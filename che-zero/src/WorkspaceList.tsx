import * as React from 'react';
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

interface WorkspaceListState {
    loading: boolean;
    data: Workspace[];
    error: boolean;
}

export default class WorkspaceList extends React.Component<Readonly<{}>, WorkspaceListState> {

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = { loading: true, data: [], error: false }
    }

    //TODO this only gets the first 30 workspaces
    componentDidMount() {
        //get workspaces
        axios.get('https://che-che.192.168.99.100.nip.io/api/workspace?skipCount=0&maxItems=30',
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${keycloak.idToken}`
                }
            })
            .then((response) => {
                this.setState({ loading: false, data: response.data })
            })
            .catch((error) => {
                this.setState({ loading: false, error: true });
            });
    }

    renderWorkspaces(data: Workspace[], error: boolean) {
        if (error) {
            return (
                <p>Error while fetching workspaces</p>
            )
        }
        if(data.length === 0) {
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

    render() {
        return (
            <div>
                <h1>Your existing workspaces:</h1>
                {this.state.loading ? "Fetching workspaces..." : this.renderWorkspaces(this.state.data, this.state.error)}
            </div>
        );
    }
}