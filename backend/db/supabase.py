from __future__ import annotations

import os
from pathlib import Path
from functools import lru_cache
from typing import Annotated, Any, Optional

from dotenv import load_dotenv
from fastapi import Depends, Header, HTTPException, status
from supabase import Client, create_client

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


class AuthenticatedUser(dict):
    @property
    def id(self) -> str:
        return self["id"]

    @property
    def email(self) -> Optional[str]:
        return self.get("email")


@lru_cache(maxsize=1)
def get_supabase_admin() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

    if not url or not key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase is not configured. Create backend/.env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        )

    return create_client(url, key)


async def get_current_user(
    authorization: Annotated[Optional[str], Header(alias="Authorization")] = None,
) -> AuthenticatedUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Supabase bearer token",
        )

    token = authorization.removeprefix("Bearer ").strip()

    try:
        auth_response = get_supabase_admin().auth.get_user(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Supabase token",
        ) from exc

    user: Any = getattr(auth_response, "user", None)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    return AuthenticatedUser({"id": user.id, "email": getattr(user, "email", None)})


CurrentUser = Annotated[AuthenticatedUser, Depends(get_current_user)]
SupabaseClient = Annotated[Client, Depends(get_supabase_admin)]
