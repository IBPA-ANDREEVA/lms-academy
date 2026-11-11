"""Regression coverage for PostgreSQL installation layouts used by CI."""

import subprocess
from pathlib import Path
from unittest.mock import patch

import pytest

from scripts import verify_postgres
from scripts.verify_postgres import postgres_share_directory


@pytest.mark.parametrize("layout", ["share", "share/postgresql", "share/postgresql/18"])
def test_uses_selected_installation_sharedir(
    tmp_path: Path, layout: str, monkeypatch: pytest.MonkeyPatch
) -> None:
    binaries = tmp_path / "bin"
    sharedir = tmp_path / layout
    sharedir.mkdir(parents=True)
    (sharedir / "postgres.bki").write_text("synthetic installation data")
    monkeypatch.setenv("PGHOSTADDR", "must-not-inherit")
    with patch("scripts.verify_postgres.subprocess.run") as run:
        run.return_value = subprocess.CompletedProcess([], 0, str(sharedir) + "\n", "")
        assert postgres_share_directory(binaries) == sharedir
        assert run.call_args.args[0] == [str(binaries / "pg_config"), "--sharedir"]
        assert "PGHOSTADDR" not in run.call_args.kwargs["env"]
        assert run.call_args.kwargs["timeout"] == 10


@pytest.mark.parametrize("reported", ["", "relative/share", "missing"])
def test_rejects_missing_or_invalid_installation_data(
    tmp_path: Path, reported: str
) -> None:
    output = str(tmp_path / "missing") if reported == "missing" else reported
    with patch("scripts.verify_postgres.subprocess.run") as run:
        run.return_value = subprocess.CompletedProcess([], 0, output, "")
        with pytest.raises(RuntimeError, match="pg_config --sharedir"):
            postgres_share_directory(tmp_path / "bin")


def test_failed_pg_config_has_no_layout_fallback(tmp_path: Path) -> None:
    with patch("scripts.verify_postgres.subprocess.run") as run:
        run.side_effect = subprocess.CalledProcessError(1, ["pg_config"])
        with pytest.raises(subprocess.CalledProcessError):
            postgres_share_directory(tmp_path / "bin")


@pytest.mark.parametrize("exit_code", [0, 1])
def test_bootstrap_password_uses_stdin_without_a_file_or_command_line_secret(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, exit_code: int
) -> None:
    binaries = tmp_path / "bin"
    sharedir = tmp_path / "share"
    sharedir.mkdir()
    (sharedir / "postgres.bki").touch()
    monkeypatch.setenv("POSTGRES_BIN", str(binaries))
    monkeypatch.setattr(
        "scripts.verify_postgres.secrets.token_hex", lambda _: "synthetic-secret"
    )
    commands: list[list[str]] = []

    def run(command: list[str], **kwargs: object) -> subprocess.CompletedProcess[str]:
        commands.append(command)
        assert all("synthetic-secret" not in argument for argument in command)
        tool = Path(command[0]).name
        if tool == "pg_config":
            return subprocess.CompletedProcess(command, 0, str(sharedir), "")
        if tool == "postgres":
            return subprocess.CompletedProcess(
                command, 0, "postgres (PostgreSQL) 18.6", ""
            )
        if tool == "initdb":
            assert "--pwfile=/dev/stdin" in command
            assert "--auth=scram-sha-256" in command
            assert kwargs["input"] == b"synthetic-secret\n"
            assert kwargs["stdin"] is None  # subprocess.run creates a private pipe.
            assert kwargs["stdout"] == kwargs["stderr"] == subprocess.DEVNULL
            data = Path(command[command.index("-D") + 1])
            assert list(data.parent.iterdir()) == []
            data.mkdir()
            return subprocess.CompletedProcess(command, exit_code, "", "")
        return subprocess.CompletedProcess(command, 0, "", "")

    monkeypatch.setattr("scripts.verify_postgres.subprocess.run", run)
    if exit_code:
        with pytest.raises(
            RuntimeError, match="^initdb failed .*raw output suppressed"
        ):
            verify_postgres.main()
        assert not any(Path(command[0]).name == "pg_ctl" for command in commands)
    else:
        assert verify_postgres.main() == 0
    initdb = next(command for command in commands if Path(command[0]).name == "initdb")
    assert not Path(initdb[initdb.index("-D") + 1]).parent.exists()
