import k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const agonesApi = kc.makeApiClient(k8s.CustomObjectsApi);

const gameServerAllocation = {
  apiVersion: 'allocation.agones.dev/v1',
  kind: 'GameServerAllocation',
  spec: {
    required: {
      matchLabels: {
        'agones.dev/fleet': 'first-gs',
      },
    },
  },
};

export default async function allocate() {
  try {
    const response = await agonesApi.createNamespacedCustomObject(
      'allocation.agones.dev',
      'v1',
      'default',
      'gameserverallocations',
      gameServerAllocation
    );

    return {
      ip: response.body.status.address,
      port: response.body.status.ports[0].port,
    };
  } catch (error) {
    console.log('Allocation Error:', error);
    return {};
  }
}
