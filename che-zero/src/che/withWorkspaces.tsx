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
import Keycloak from 'keycloak-js';
import React, { useCallback, useEffect, useState } from 'react';

import { useStateWithoutNotifications } from '../util';
import { Workspace } from './workspaces';

/** Properties needed to communicate with Che. */
export interface CheProps {
  cheDomain: string;
  keycloak: Keycloak.KeycloakInstance;
}

/** Properties handend into components wrapped in the withWorkspaces HOC. */
export interface WithWorkspacesProps {
  error: boolean;
  /**
   * undefined if no workspaces were fetched yet or an error occured while fetching them.
   * In the latter case, error will also be truthy.
   */
  workspaces?: Workspace[];
  /** Forces an refresh of the workspace list. */
  refreshWorkspaces: () => void;
}

/**
 * Fetch available workspaces from Che.
 *
 * TODO: this only gets the first 30 workspaces
 */
const fetchWorkspaces = (
  cheDomain: string,
  keycloakIdToken: string | undefined,
  isFetching: () => boolean,
  setFetching: (fetching: boolean) => void,
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[] | undefined>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (isFetching()) {
    return;
  }
  setFetching(true);

  axios
    .get(`https://che-che.${cheDomain}/api/workspace?skipCount=0&maxItems=30`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${keycloakIdToken}`,
      },
    })
    .then((response) => {
      setWorkspaces(response.data);
    })
    .catch(() => {
      setError(true);
      setWorkspaces(undefined);
    })
    .finally(() => setFetching(false));
};

/** Interval to fetch workspaces in milli seconds. */
const FETCH_INTERVAL = 5000;

/**
 * Injects fetched workspaces in a wrapped component.
 * @param <T> Type describing the wrapped component's properties excluding the injected properties.
 * @returns a new component which takes the wrapped component's properties
 *          as well as che configuration (url and authentication)
 */
export const withWorkspaces = <T extends {}>(
  Component: React.ComponentType<T & WithWorkspacesProps>
): React.FC<T & CheProps> => (props) => {
  const {
    cheDomain,
    keycloak: { idToken },
  } = props;
  const [workspaces, setWorkspaces] = useState<Workspace[]>();
  const [error, setError] = useState(false);

  // Use state that won't trigger dependency change of useCallback below even if a new value is set.
  const [isFetching, setFetching] = useStateWithoutNotifications(false);

  const refreshWorkspaces = useCallback(() => {
    fetchWorkspaces(
      cheDomain,
      idToken,
      isFetching,
      setFetching,
      setWorkspaces,
      setError
    );
  }, [cheDomain, idToken, isFetching, setFetching]);

  useEffect(() => {
    refreshWorkspaces();
    const interval = setInterval(refreshWorkspaces, FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshWorkspaces]);

  return (
    <Component
      error={error}
      workspaces={workspaces}
      refreshWorkspaces={refreshWorkspaces}
      {...props}
    />
  );
};
