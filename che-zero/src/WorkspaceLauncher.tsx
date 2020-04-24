import React from "react";
import axios from 'axios';
import { Devfile } from "./devfile";
import { javaDevfile } from './DevFiles';
import { Workspace, getDevFile } from "./WorkspaceList";
import { useParams } from "react-router-dom";

interface WorkspaceLauncherProps {
    cheDomain: string;
    keycloak: Keycloak.KeycloakInstance;
}

function createAndOpenWorkspace(devfile: Devfile, props: WorkspaceLauncherProps) {
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

interface WorkspaceLauncherParams {
    name?: string;
    stack?: string;
}

const WorkspaceLauncher = (props: WorkspaceLauncherProps) => {
    const params: WorkspaceLauncherParams = useParams();
    if (params.name !== undefined && params.stack !== undefined) {
        createAndOpenWorkspace(getDevFile(params.name, params.stack), props)
    }
    return (
        <div />
    );
}

export default WorkspaceLauncher;