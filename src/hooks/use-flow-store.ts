import { ImageNodeProps, TextNodeProps } from "@/@types";
import { api } from "@/lib/axios";
import axios from "axios";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges
} from "reactflow";
import { v4 } from "uuid";
import { createWithEqualityFn } from "zustand/traditional";

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  reactFlowInstance: any | null;
  scheduleTime: string | null;
  setScheduleTime: (value: string) => void;
  setReactFlowInstance: (value: any) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onDragOver: (event: any) => void;
  onDrop: (event: any) => void;
  deleteNode: (id: string) => void;
  saveFlow: (id: string, nodes?: Array<{ id: string } & Record<string, unknown>>) => Promise<void>;
  editTextNode: (id: string, values: TextNodeProps) => void;
  editImageNode: (id: string, values: ImageNodeProps) => Promise<void>;
  editImageSheet: (userId: string, image: File | string) => Promise<{ url: string }>;
  isUploading: boolean;
  setIsUploading: (values: boolean) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useFlowStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  scheduleTime: null,
  isUploading: false,
  setIsUploading: (value: boolean) => {
    set({ isUploading: value });
  },
  setScheduleTime: (value: string) => {
    set({ scheduleTime: value });
  },
  reactFlowInstance: null,
  setReactFlowInstance: (value: any) => {
    set({ reactFlowInstance: value });
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, type: "buttonedge" }, get().edges),
    });
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  onDragOver: (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  },
  onDrop: (event: any) => {
    const { nodes, reactFlowInstance } = get();
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (typeof type === 'undefined' || !type) {
      return;
    }
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNodeId = v4();
    const newNode = {
      id: newNodeId,
      type,
      position,
      data: { label: `${type}_node` },
    };

    set({ nodes: nodes.concat(newNode) });
  },
  deleteNode: (id: string) => {
    const { nodes, edges } = get();
    const updatedNodes = nodes.filter((node) => node.id !== id);
    const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id);
    set({ nodes: updatedNodes, edges: updatedEdges });
  },
  saveFlow: async (id: string, nodes?: Array<{ id: string } & Record<string, unknown>>) => {
    if (!nodes) {
      const { nodes, edges } = get();
      await api.put(`/resources/workflows/${id}`, { nodes, edges });
    }
    await api.put(`/resources/workflows/${id}`, { nodes });
  },
  editTextNode: (id: string, values: TextNodeProps) => {
    const { nodes } = get();
    set({
      nodes: nodes.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            ...values
          }
        }
        return node;
      })
    })
  },
  editImageNode: async (id: string, values: ImageNodeProps) => {
    const { nodes } = get();
    let bodyFormData = new FormData();
    bodyFormData.append("userId", values.userId);
    bodyFormData.append("image", values.image);
    bodyFormData.append("message", values.message);
    set({ isUploading: true });
    const result = await axios.post("/api/s3-upload", bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    set({ isUploading: false });
    set({
      nodes: nodes.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            image: result.data.url,
            message: values.message
          }
        }
        return node;
      })
    })
  },
  editImageSheet: async (userId: string, image: File | string): Promise<{ url: string }> => {
    let bodyFormData = new FormData();
    bodyFormData.append("userId", userId);
    bodyFormData.append("image", image);
    set({ isUploading: true });
    const result = await axios.post("/api/s3-upload", bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    set({ isUploading: false });
    return { url: result.data.url }
  }
}));