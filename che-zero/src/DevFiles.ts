import { DevfileObject } from './devfile';

export function coffeeDevfile(name: string): DevfileObject {
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
}

export function javaDevfile(name: string): DevfileObject {
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
}
