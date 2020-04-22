import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { keycloak } from '.';

interface Workspace {
    id: string;
    status: string,
    attributes: {
        stackName: string;
    }
    devfile: {
        metadata: {
            name: string;
        };
    };
}

interface WorkspaceListProps {
    cheDomain: string;
}

interface WorkspaceListState {
    loading: boolean;
    data: Workspace[];
    error: boolean;
}

function renderWorkspaces(data: Workspace[], error: boolean) {
    if (error) {
        return (
            <p>Error while fetching workspaces</p>
        )
    }
    if (data.length === 0) {
        return (
            <p>No existing workspaces for your user</p>
        )
    }
    return (
        <ul>
            {
                data.map((ws: Workspace) => (
                    <li key={ws.id}>Name: {ws.devfile.metadata.name} | Stack: {ws.attributes.stackName} | Status: {ws.status}</li>
                ))
            }
        </ul>
    );
}

const WorkspaceList = (props: WorkspaceListProps) => {

    const [loading, setLoading] = useState(true);
    const [data, setWorkspaces] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        //TODO this only gets the first 30 workspaces
        //get workspaces
        axios.get(`https://che-che.${props.cheDomain}/api/workspace?skipCount=0&maxItems=30`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${keycloak.idToken}`
                }
            })
            .then((response) => {
                setWorkspaces(response.data)
                setLoading(false)
            })
            .catch((error) => {
                setError(true)
                setLoading(false)
            });
    });

    return (
        <div>
            <h1>Your existing workspaces:</h1>
            {loading ? "Fetching workspaces..." : renderWorkspaces(data, error)}
        </div>
    );
}

export default WorkspaceList;
