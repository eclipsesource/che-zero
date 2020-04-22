export interface Devfile {
    metadata?: {
        name?: string,
        generateName?: string
    },
    commands?: {
        actions?: {
            workdir?: string,
            command?: string,
            component?: string,
            referenceContent?: string,
            reference?: string,
            type?: string
        }[],
        previewUrl?: {
            port?: number,
            path?: string
        },
        attributes?: {},
        name?: string
    }[],
    projects?: {
        clonePath?: string,
        source?: {
            tag?: string,
            startPoint?: string,
            commitId?: string,
            sparseCheckoutDir?: string,
            branch?: string,
            type?: string,
            location?: string
        },
        name?: string
    }[],
    apiVersion?: string,
    components?: {
        id?: string,
        env?: {
            name?: string,
            value?: string
        }[],
        preferences?: {},
        alias?: string,
        registryUrl?: string,
        volumes?: {
            containerPath?: string,
            name?: string
        }[],
        selector?: {},
        args?: string[],
        command?: string[],
        image?: string,
        endpoints?: {
            attributes?: {},
            port?: 0,
            name?: string
        }[],
        mountSources?: boolean,
        referenceContent?: string,
        entrypoints?: {
            containerName?: string,
            args?: string[],
            command?: string[],
            parentName?: string,
            parentSelector?: {}
        }[],
        memoryLimit?: string,
        reference?: string,
        memoryRequest?: string,
        cpuLimit?: string,
        cpuRequest?: string,
        type?: string
    }[],
    attributes?: {},
    name?: string
}