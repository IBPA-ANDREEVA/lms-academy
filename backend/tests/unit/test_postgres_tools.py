"""Regression coverage for PostgreSQL installation layouts used by CI."""

import subprocess
from pathlib import Path
from unittest.mock import patch

import pytest

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
