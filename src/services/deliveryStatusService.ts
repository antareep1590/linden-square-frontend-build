
// Shared service to manage delivery statuses across modules
export type DeliveryStatus = "pending" | "processing" | "dispatched" | "out-for-delivery" | "delivered" | "cancelled";

export interface DeliveryStatusUpdate {
  orderId: string;
  status: DeliveryStatus;
  updatedAt: Date;
  updatedBy?: string;
}

class DeliveryStatusService {
  private listeners: ((update: DeliveryStatusUpdate) => void)[] = [];
  private statusHistory: Map<string, DeliveryStatusUpdate[]> = new Map();

  // Subscribe to status updates
  subscribe(callback: (update: DeliveryStatusUpdate) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Update status and notify all subscribers
  updateStatus(orderId: string, status: DeliveryStatus, updatedBy?: string) {
    const update: DeliveryStatusUpdate = {
      orderId,
      status,
      updatedAt: new Date(),
      updatedBy
    };

    // Store in history
    if (!this.statusHistory.has(orderId)) {
      this.statusHistory.set(orderId, []);
    }
    this.statusHistory.get(orderId)!.push(update);

    // Notify all listeners
    this.listeners.forEach(listener => listener(update));
  }

  // Get status history for an order
  getStatusHistory(orderId: string): DeliveryStatusUpdate[] {
    return this.statusHistory.get(orderId) || [];
  }

  // Get current status for an order
  getCurrentStatus(orderId: string): DeliveryStatus | null {
    const history = this.getStatusHistory(orderId);
    return history.length > 0 ? history[history.length - 1].status : null;
  }
}

export const deliveryStatusService = new DeliveryStatusService();
