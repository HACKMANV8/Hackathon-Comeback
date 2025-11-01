from pydantic import BaseModel
from typing import Optional


class Repository(BaseModel):
    type: str
    url: str


class Meta(BaseModel):
    created_at: str
    updated_at: str


class Pricing(BaseModel):
    currency: str
    amount: float


class MCPInit(BaseModel):
    name: str
    version: str
    description: str
    author: str
    lang: str
    license: str
    entrypoint: str
    repository: Repository
    pricing: Pricing
    meta: Optional[Meta] = None
