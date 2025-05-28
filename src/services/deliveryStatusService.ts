
export type DeliveryStatus = "pending" | "processing" | "shipped" | "in-transit" | "out-for-delivery" | "delivered" | "cancelled";

interface DeliveryStatusUpdate {
  orderId: string;
  status: DeliveryStatus;
  timestamp: Date;
  updatedBy?: string;
}

class DeliveryStatusService {
  private statusListeners: ((update: DeliveryStatusUpdate) => void)[] = [];
  private deliveryStatuses: Map<string, DeliveryStatus> = new Map();

  // Subscribe to status updates
  subscribe(callback: (update: DeliveryStatusUpdate) => void) {
    this.statusListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.statusListeners.indexOf(callback);
      if (index > -1) {
        this.statusListeners.splice(index, 1);
      }
    };
  }

  // Update delivery status - this will notify all subscribers
  updateStatus(orderId: string, status: DeliveryStatus, updatedBy?: string) {
    this.deliveryStatuses.set(orderId, status);
    
    const update: DeliveryStatusUpdate = {
      orderId,
      status,
      timestamp: new Date(),
      updatedBy
    };

    // Notify all subscribers
    this.statusListeners.forEach(callback => callback(update));
    
    console.log(`Delivery status updated for ${orderId}: ${status}`);
  }

  // Get current status for an order
  getStatus(orderId: string): DeliveryStatus | undefined {
    return this.deliveryStatuses.get(orderId);
  }

  // Get all statuses
  getAllStatuses(): Map<string, DeliveryStatus> {
    return new Map(this.deliveryStatuses);
  }
}

// Create a singleton instance
export const deliveryStatusService = new DeliveryStatusService();
