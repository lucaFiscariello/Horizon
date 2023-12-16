import apt
from apt.progress.base import OpProgress
import shutil
import subprocess
from typing import Dict, List, NoReturn


def install_apt(packages: List, update: bool = False, progress=None) -> NoReturn:
    cache = apt.cache.Cache()
    if update:
        cache.update()
    cache.open()
    for package in packages:
        pkg = cache[package]
        if not pkg.is_installed:
            pkg.mark_install()
    cache.commit(install_progress=progress)


def remove_apt(packages: List, update: bool = False, progress=None) -> NoReturn:
    cache = apt.cache.Cache()
    if update:
        cache.update()
    cache.open()
    for package in packages:
        pkg = cache[package]
        if pkg.is_installed:
            pkg.mark_delete()
    cache.commit(install_progress=progress)


def upgrade_apt(update: bool = False, progress=None) -> NoReturn:
    cache = apt.cache.Cache()
    if update:
        cache.update()
    cache.open()
    cache.upgrade(dist_upgrade=True)
    cache.commit(install_progress=progress)


def shell(command: str) -> NoReturn:
    subprocess.run(command, shell=True).check_returncode()
