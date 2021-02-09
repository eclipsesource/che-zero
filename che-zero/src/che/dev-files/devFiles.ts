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
import { DevfileObject } from './types';

export const coffeeDevfile = (name: string): DevfileObject => {
  return {
    metadata: {
      name: name,
    },
    components: [
      {
        id: 'eclipsesource/coffee/latest',
        type: 'cheEditor',
      },
    ],
    apiVersion: '1.0.0',
  };
};

export const javaDevfile = (name: string): DevfileObject => {
  return {
    metadata: {
      name: name,
    },
    components: [
      {
        id: 'redhat/java11/latest',
        type: 'chePlugin',
      },
      {
        mountSources: true,
        memoryLimit: '512Mi',
        type: 'dockerimage',
        volumes: [
          {
            name: 'gradle',
            containerPath: '/home/gradle/.gradle',
          },
        ],
        alias: 'gradle',
        image: 'quay.io/eclipse/che-java11-gradle:7.11.0',
        env: [
          {
            value: '/home/gradle/.gradle',
            name: 'GRADLE_USER_HOME',
          },
          {
            value:
              '-XX:MaxRAMPercentage=50 -XX:+UseParallelGC -XX:MinHeapFreeRatio=10 -XX:MaxHeapFreeRatio=20 -XX:GCTimeRatio=4 -XX:AdaptiveSizePolicyWeight=90 -Dsun.zip.disableMemoryMapping=true -Xms20m -Djava.security.egd=file:/dev/./urandom',
            name: 'JAVA_OPTS',
          },
          {
            value:
              '-XX:MaxRAMPercentage=50 -XX:+UseParallelGC -XX:MinHeapFreeRatio=10 -XX:MaxHeapFreeRatio=20 -XX:GCTimeRatio=4 -XX:AdaptiveSizePolicyWeight=90 -Dsun.zip.disableMemoryMapping=true -Xms20m -Djava.security.egd=file:/dev/./urandom',
            name: 'JAVA_TOOL_OPTIONS',
          },
          {
            value: '/home/gradle',
            name: 'HOME',
          },
        ],
      },
    ],
    apiVersion: '1.0.0',
  };
};

export const getDevFile = (
  workspaceName: string,
  workspaceStack: string
): DevfileObject => {
  if (workspaceStack === 'coffee') {
    return coffeeDevfile(workspaceName);
  }
  return javaDevfile(workspaceName);
};
