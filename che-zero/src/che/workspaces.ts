/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import axios from 'axios';

import { DevfileObject } from './dev-files';

export type WorkspaceStatus = 'RUNNING' | 'STARTING' | 'STOPPED' | 'STOPPING';

export interface Workspace {
  id: string;
  status: WorkspaceStatus;
  namespace: string;
  devfile: {
    metadata: {
      name: string;
    };
  };
}

/** Creates a new workspace for the given dev file. */
export const createWorkspace = (
  devfile: DevfileObject,
  cheDomain: string,
  keycloakIdToken: string | undefined,
  /**
   * Called after the REST call to create the workspace returned successfully.
   * Note that this only means that the server accepted creating the workspace
   * but NOT that the creation process was completed, yet.
   * */
  onSuccess: () => void
) => {
  axios
    .post(`https://che-che.${cheDomain}/api/workspace/devfile`, devfile, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${keycloakIdToken}`,
      },
    })
    .then((response) => onSuccess())
    .catch((error) => {
      alert('There was a problem, please retry');
    });
};

/** Opens the given workspace in a new browser tab. */
export const openWorkspace = (ws: Workspace, cheDomain: string) => {
  window.open(
    `https://che-che.${cheDomain}/workspace-loader/` +
      ws.namespace +
      '/' +
      ws.devfile.metadata.name,
    '_blank'
  );
};

/** Starts the workspace given by its id. */
export const startWorkspace = (
  id: string,
  cheDomain: string,
  keycloakIdToken: string | undefined,
  /**
   * Called after the REST call to start the workspace returned successfully.
   * Note that this only means that the server accepted starting the workspace
   * but NOT that the start process was completed.
   */
  onSuccess?: () => void
) => {
  axios
    .post(
      `https://che-che.${cheDomain}/api/workspace/` +
        id +
        '/runtime?debug-workspace-start=false',
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${keycloakIdToken}`,
        },
      }
    )
    .then((response) => {
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch((error) => {
      console.error('Starting workspace failed', error);
    });
};

/** Stops the workspace given by its id. */
export const stopWorkspace = (
  id: string,
  cheDomain: string,
  keycloakIdToken: string | undefined,
  /**
   * Called after the REST call to stop the server returned successfully.
   * Note that this only means that the server accepted stopping the workspace
   * but NOT that the stop process was completed, yet.
   */
  onSuccess?: () => void
) => {
  axios
    .delete(`https://che-che.${cheDomain}/api/workspace/` + id + '/runtime', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${keycloakIdToken}`,
      },
    })
    .then((response) => {
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch((error) => {
      console.error('Stopping workspace failed', error);
    });
};

/** Deletes the workspace given by its id. */
export const deleteWorkspace = (
  id: string,
  cheDomain: string,
  keycloakIdToken: string | undefined,
  /**
   * Called after the REST call to delete the workspace returned successfully.
   * Note that this only means that the server accepted deleting the workspace
   * but NOT that the delete process was completed, yet.
   */
  onSuccess?: () => void
) => {
  axios
    .delete(`https://che-che.${cheDomain}/api/workspace/` + id, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${keycloakIdToken}`,
      },
    })
    .then((response) => {
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch((error) => {
      console.error('Deleting workspace failed', error);
    });
};
