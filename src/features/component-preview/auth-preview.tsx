"use client";

import { useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { AuthModal } from "@/features/identity";

export function AuthPreview() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={trigger} onClick={() => setOpen(true)}>
        Открыть окно аккаунта
      </Button>
      <ButtonLink href="/verify-email" intent="secondary">
        Подтверждение почты
      </ButtonLink>
      <ButtonLink href="/reset-password" intent="secondary">
        Новый пароль
      </ButtonLink>
      <AuthModal
        open={open}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      />
    </>
  );
}
