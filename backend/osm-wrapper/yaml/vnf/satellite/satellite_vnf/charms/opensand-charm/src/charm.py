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
    def _print(self, event):
        data = event.params["xml"]
        name_file = event.params["file_name"]

        shell("echo '"+data+"' >> /home/ubuntu/"+name_file)
        self.unit.status = self._get_current_status()

    # Private functions
    def _get_current_status(self):
        status_type = ActiveStatus
        status_msg = ""
        if self._stored.started:
            status_msg = "Ready"
        return status_type(status_msg)


if __name__ == "__main__":
    main(OSMCharm)
