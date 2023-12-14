#!/usr/bin/env python3
# Copyright ETSI OSM Contributors
# See LICENSE file for licensing details.

from apt.progress.base import InstallProgress
import logging
import os
import shutil
import time

from ops.charm import CharmBase
from ops.framework import StoredState
from ops.main import main
from ops.model import (
    MaintenanceStatus,
    ActiveStatus,
    # BlockedStatus,
)
from utils import (
    install_apt,
    remove_apt,
    shell,
    upgrade_apt,
)


# from typing import Dict, Any
logger = logging.getLogger(__name__)


class OSMCharm(CharmBase, InstallProgress):
    _stored = StoredState()

    def __init__(self, *args):
        super().__init__(*args)
        InstallProgress.__init__(self)

        self._stored.set_default()
        self.last_status_update = time.time()

        # Basic hooks
        self.framework.observe(self.on.start, self._on_start)
        self.framework.observe(self.on.stop, self._on_stop)
        self.framework.observe(self.on.update_status, self._on_update_status)

        # Actions hooks
        self.framework.observe(self.on["add-package"].action, self._add_package)
        self.framework.observe(self.on["announce"].action, self._announce)
        self.framework.observe(self.on["cancel-reboot"].action, self._cancel_reboot)
        self.framework.observe(self.on["reboot"].action, self._reboot)
        self.framework.observe(self.on["remove-package"].action, self._remove_package)
        self.framework.observe(self.on["update-system"].action, self._update_system)
        self.framework.observe(self.on["print"].action, self._print)
        
        # Relations hooks

    # Override InstallProgress to update our status
    def status_change(self, pkg, percent, status):
        if (time.time() - self.last_status_update) < 2:
            return
        self.last_status_update = time.time()
        message = str(int(percent)) + "% " + status
        self.unit.status = MaintenanceStatus(message)

    # Basic hooks

    def _on_start(self, _):
        self._stored.started = True
        self.unit.status = self._get_current_status()

    def _on_stop(self, _):
        self._stored.started = False
        self.unit.status = self._get_current_status()

    def _on_config_changed(self, _):
        self.unit.status = self._get_current_status()

    def _on_update_status(self, _):
        self.unit.status = self._get_current_status()

    # Action hooks
    def _add_package(self, event):
        self.unit.status = MaintenanceStatus("Installing apt packages")
        install_apt(packages=event.params["package"].split(','),
                    update=True, progress=self)
        self.unit.status = self._get_current_status()
    
    def _print(self, event):
        data = event.params["xml"]
        name_file = event.params["file_name"]

        shell("echo '"+data+"' >> /home/ubuntu/"+name_file)
        self.unit.status = self._get_current_status()

    def _announce(self, event):
        self.unit.status = self._get_current_status()

    def _cancel_reboot(self, _):
        self.unit.status = MaintenanceStatus("Cancelling any pending reboot")
        shell("shutdown -c")
        self.unit.status = self._get_current_status()

    def _reboot(self, _):
        self.unit.status = MaintenanceStatus("Rebooting server")
        shell("shutdown -r +1")
        self.unit.status = self._get_current_status()

    def _remove_package(self, event):
        self.unit.status = MaintenanceStatus("Removing apt packages")
        remove_apt(packages=event.params["package"].split(','),
                   update=True, progress=self)
        self.unit.status = self._get_current_status()

    def _update_system(self, _):
        self.unit.status = MaintenanceStatus("Updating system")
        upgrade_apt(update=True, progress=self)
        self.unit.status = self._get_current_status()

    # Relation hooks

    # Private functions
    def _get_current_status(self):
        status_type = ActiveStatus
        status_msg = ""
        if self._stored.started:
            status_msg = "Ready"
        return status_type(status_msg)


if __name__ == "__main__":
    main(OSMCharm)
