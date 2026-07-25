"""
Seed the database with reference data:
- 35 behavioral dimensions
- 20 classification labels
- 8 intervention library entries
- 1 default admin user
"""

import json
import asyncio
from pathlib import Path

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.core.security import hash_password
from app.models.dimension import BehavioralDimension
from app.models.label import Label
from app.models.school import School
from app.models.user import User

SEED_DIR = Path(__file__).parent


async def seed_dimensions(db: AsyncSession):
    """Seed behavioral dimensions from JSON."""
    with open(SEED_DIR / "dimensions.json", "r", encoding="utf-8") as f:
        dimensions = json.load(f)

    existing = await db.execute(select(BehavioralDimension.code))
    existing_codes = {r[0] for r in existing}

    added = 0
    for dim in dimensions:
        if dim["code"] in existing_codes:
            continue
        db.add(BehavioralDimension(**dim))
        added += 1

    await db.flush()
    print(f"  Dimensions: {added} added, {len(existing_codes)} existing")


async def seed_labels(db: AsyncSession):
    """Seed classification labels from JSON."""
    with open(SEED_DIR / "labels.json", "r", encoding="utf-8") as f:
        labels = json.load(f)

    existing = await db.execute(select(Label.name_zh))
    existing_names = {r[0] for r in existing}

    added = 0
    for label in labels:
        if label["name_zh"] in existing_names:
            continue
        db.add(Label(**label))
        added += 1

    await db.flush()
    print(f"  Labels: {added} added, {len(existing_names)} existing")


async def seed_admin_user(db: AsyncSession):
    """Create default admin user if not exists."""
    existing = await db.execute(select(User).where(User.username == "admin"))
    if existing.scalar_one_or_none():
        print("  Admin user already exists")
        return

    admin = User(
        username="admin",
        password_hash=hash_password("admin123"),
        email="admin@school.edu.cn",
        full_name="系统管理员",
        role="admin",
        is_active=True,
    )
    db.add(admin)
    await db.flush()
    print("  Admin user created (username: admin, password: admin123)")


async def seed_demo_school(db: AsyncSession):
    """Create a demo school."""
    existing = await db.execute(select(School).where(School.name == "阳光实验学校"))
    if existing.scalar_one_or_none():
        print("  Demo school already exists")
        return

    school = School(
        name="阳光实验学校",
        school_type="elementary",
        district="朝阳区",
        address="北京市朝阳区阳光路1号",
    )
    db.add(school)
    await db.flush()
    print("  Demo school created")


async def run_seed():
    """Run all seed functions."""
    engine = create_async_engine(settings.DATABASE_URL)
    session_factory = async_sessionmaker(engine, class_=AsyncSession)

    async with session_factory() as db:
        print("Seeding database...")

        print("\n[1/4] Behavioral Dimensions")
        await seed_dimensions(db)

        print("\n[2/4] Classification Labels")
        await seed_labels(db)

        print("\n[3/4] Admin User")
        await seed_admin_user(db)

        print("\n[4/4] Demo School")
        await seed_demo_school(db)

        await db.commit()
        print("\nSeed complete!")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(run_seed())
