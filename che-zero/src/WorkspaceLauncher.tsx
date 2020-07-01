import React from "react";
import axios from 'axios';
import { DevfileObject } from "./devfile";
import { Workspace, getDevFile } from "./WorkspaceList";
import { useParams } from "react-router-dom";

interface WorkspaceLauncherProps {
    cheDomain: string;
    keycloak: Keycloak.KeycloakInstance;
}

function createAndOpenWorkspace(devfile: DevfileObject, props: WorkspaceLauncherProps) {
    axios.post(`https://che-che.${props.cheDomain}/api/workspace/devfile`, devfile,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${props.keycloak.idToken}`
            }
        })
        .then((response) => {
            const ws: Workspace = response.data;
            window.location.replace(`https://che-che.${props.cheDomain}/workspace-loader/` + ws.namespace + '/' + ws.devfile.metadata.name)
        })
        .catch((error) => {
            alert("There was a problem, please retry")
        })
}

const WorkspaceLauncher = (props: WorkspaceLauncherProps) => {
    const { name, stack } = useParams();
    if (name !== undefined && stack !== undefined) {
        createAndOpenWorkspace(getDevFile(name, stack), props)
    }
    return (
        <div />
    );
}

export default WorkspaceLauncher;