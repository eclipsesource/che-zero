import axios from 'axios';
import Keycloak from 'keycloak-js';
import React, { ComponentType, useEffect, useState } from 'react';

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
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[] | undefined>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
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
    });
};

/**
 * Injects fetched workspaces in a wrapped component.
 * @param <T> Type describing the wrapped component's properties excluding the injected properties.
 * @returns a new component which takes the wrapped component's properties
 *          as well as che configuration (url and authentication)
 */
export const withWorkspaces = <T extends {}>(
  Component: React.ComponentType<T & WithWorkspacesProps>
): React.FC<T & CheProps> => (props) => {
  const { cheDomain, keycloak } = props;
  const [workspaces, setWorkspaces] = useState<Workspace[]>();
  const [error, setError] = useState(false);

  const refreshWorkspaces = () =>
    fetchWorkspaces(cheDomain, keycloak.idToken, setWorkspaces, setError);

  useEffect(refreshWorkspaces, [cheDomain, keycloak.idToken]);

  return (
    <Component
      error={error}
      workspaces={workspaces}
      refreshWorkspaces={refreshWorkspaces}
      {...props}
    />
  );
};
