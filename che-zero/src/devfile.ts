/**
 * Copyright (c) 2012-2019 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * SPDX-License-Identifier: EPL-2.0
 * Contributors:
 * Red Hat, Inc. - initial API and implementation
 */

/* tslint:disable */

/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 *
 * The JSONSchema file can be found here: https://raw.githubusercontent.com/redhat-developer/devfile/master/docs/devfile.json
 */

export type TheProjectName = string;
/**
 * Description of the projects, containing names and sources locations
 */
export type TheProjectsList = {
  name: TheProjectName;
  source: TheProjectSourceObject;
  /**
   * The path relative to the root of the projects to which this project should be cloned into. This is a unix-style relative path (i.e. uses forward slashes). The path is invalid if it is absolute or tries to escape the project root through the usage of '..'. If not specified, defaults to the project name.
   */
  clonePath?: string;
}[];
/**
 * The environment variable name
 */
export type TheEnvironmentVariableName = string;
/**
 * The environment variable value
 */
export type TheEnvironmentVariableValue = string;
/**
 * Description of the workspace components, such as editor and plugins
 */
export type TheComponentsList = {
  /**
   * The name using which other places of this devfile (like commands) can refer to this component. This attribute is optional but must be unique in the devfile if specified.
   */
  alias?: string;
  /**
   * Describes type of the component, e.g. whether it is an plugin or editor or other type
   */
  type: 'cheEditor' | 'chePlugin' | 'kubernetes' | 'openshift' | 'dockerimage';
  /**
   * Describes whether projects sources should be mount to the component. `CHE_PROJECTS_ROOT` environment variable should contains a path where projects sources are mount
   */
  mountSources?: boolean;
  /**
   * The environment variables list that should be set to docker container
   */
  env?: {
    name: TheEnvironmentVariableName;
    value: TheEnvironmentVariableValue;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}[];
/**
 * List of the actions of given command. Now the only one command must be specified in list but there are plans to implement supporting multiple actions commands.
 */
export type TheCommandActionsList = [
  | {
      type: unknown;
      component: unknown;
      command: unknown;
      workdir?: unknown;
    }
  | (
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
    )
];
/**
 * Description of the predefined commands to be available in workspace
 */
export type TheCommandsList = {
  /**
   * Describes the name of the command. Should be unique per commands set.
   */
  name: string;
  /**
   * Additional command attributes
   */
  attributes?: {
    [k: string]: string;
  };
  actions: TheCommandActionsList;
  previewUrl?: {
    port: number;
    path?: string;
    [k: string]: unknown;
  };
}[];

/**
 * This schema describes the structure of the devfile object
 */
export interface DevfileObject {
  apiVersion: DevfileAPIVersion;
  metadata: {
    [k: string]: unknown;
  };
  projects?: TheProjectsList;
  components?: TheComponentsList;
  commands?: TheCommandsList;
  attributes?: {
    [k: string]: string;
  };
}
export type DevfileAPIVersion = string;

/**
 * Describes the project's source - type and location
 */
export interface TheProjectSourceObject {
  /**
   * Project's source type.
   */
  type: string;
  /**
   * Project's source location address. Should be URL for git and github located projects, or file:// for zip.
   */
  location: string;
  /**
   * The name of the of the branch to check out after obtaining the source from the location. The branch has to already exist in the source otherwise the default branch is used. In case of git, this is also the name of the remote branch to push to.
   */
  branch?: string;
  /**
   * The tag or commit id to reset the checked out branch to.
   */
  startPoint?: string;
  /**
   * The name of the tag to reset the checked out branch to. Note that this is equivalent to 'startPoint' and provided for convenience.
   */
  tag?: string;
  /**
   * The id of the commit to reset the checked out branch to. Note that this is equivalent to 'startPoint' and provided for convenience.
   */
  commitId?: string;
  /**
   * Part of project to populate in the working directory.
   */
  sparseCheckoutDir?: string;
  [k: string]: unknown;
}
