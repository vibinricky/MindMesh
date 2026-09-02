import api from './api';

export const getMyGraphs = async (page = 0, size = 10) => {
  const response = await api.get(`/graphs/my?page=${page}&size=${size}`);
  return response.data;
};

export const getPublicGraphs = async () => {
  const response = await api.get(`/graphs/public`);
  return response.data;
};

export const searchGraphs = async (query, page = 0, size = 10) => {
  const response = await api.get(`/graphs/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  return response.data;
};

export const getGraphById = async (id) => {
  const response = await api.get(`/graphs/${id}`);
  return response.data;
};

export const getFullGraph = async (id) => {
  const response = await api.get(`/graphs/${id}/full`);
  return response.data;
};

export const createGraph = async (graphData) => {
  const response = await api.post('/graphs', graphData);
  return response.data;
};

export const updateGraph = async (id, graphData) => {
  const response = await api.put(`/graphs/${id}`, graphData);
  return response.data;
};

export const deleteGraph = async (id) => {
  const response = await api.delete(`/graphs/${id}`, { responseType: 'text' });
  return response.data;
};

export const calculateComplexity = async (id) => {
  const response = await api.post(`/graphs/${id}/calculate-complexity`);
  return response.data;
};

export const getActivity = async (page = 0, size = 20) => {
  const response = await api.get(`/graphs/activity?page=${page}&size=${size}`);
  return response.data;
};

export const getAllActivity = async (page = 0, size = 20) => {
  const response = await api.get(`/graphs/activity/all?page=${page}&size=${size}`);
  return response.data;
};

export const getGraphNodes = async (graphId) => {
  const response = await api.get(`/nodes/graph/${graphId}`);
  return response.data;
};

export const addNodes = async (graphId, nodes) => {
  const response = await api.post(`/nodes/graph/${graphId}`, nodes);
  return response.data;
};

export const updateNode = async (nodeId, node) => (await api.put(`/nodes/${nodeId}`, node)).data;
export const deleteNode = async (nodeId) => api.delete(`/nodes/${nodeId}`);

export const getGraphEdges = async (graphId) => {
  const response = await api.get(`/edges/graph/${graphId}`);
  return response.data;
};

export const createEdge = async (edge) => {
  const response = await api.post(`/edges`, edge);
  return response.data;
};

export const updateEdge = async (edgeId, edge) => (await api.put(`/edges/${edgeId}`, edge)).data;
export const deleteEdge = async (edgeId) => api.delete(`/edges/${edgeId}`);

export const inviteCollaborator = async (graphId, inviteeUsername) => (await api.post('/collab/invite', { graphId, inviteeUsername })).data;
export const getPendingInvites = async () => (await api.get('/collab/pending')).data;
export const respondToInvite = async (inviteId, accepted) => (await api.post('/collab/respond', { inviteId, accepted })).data;

export const getPlatformStats = async () => {
  const response = await api.get(`/insights/stats`);
  return response.data;
};

const graphService = {
  getMyGraphs,
  getPublicGraphs,
  searchGraphs,
  getGraphById,
  getFullGraph,
  createGraph,
  updateGraph,
  deleteGraph,
  calculateComplexity,
  getActivity,
  getAllActivity,
  getGraphNodes,
  addNodes,
  updateNode,
  deleteNode,
  getGraphEdges,
  createEdge,
  updateEdge,
  deleteEdge,
  inviteCollaborator,
  getPendingInvites,
  respondToInvite,
  getPlatformStats,
};

export default graphService;
