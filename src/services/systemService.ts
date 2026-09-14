export interface HealthCheckData {
  status: 'UP' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  services: {
    database: {
      status: string;
      readyState: number;
      host: string;
      name: string;
    };
    redis: {
      status: string;
      host: string;
      port: number;
    };
  };
  system: {
    nodeVersion: string;
    memoryUsageMB: number;
  };
}

export const systemService = {
  async getHealth(): Promise<HealthCheckData | null> {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Return null on failure
    }
    return null;
  },

  async getGatewayInfo(): Promise<any> {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Return null on failure
    }
    return null;
  },
};
