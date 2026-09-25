import ProtectedRoute from "@/components/ProtectedRoute";
import TrackingCar from "@/components/vehicles/TrackingCar";

const TrackingCarScreen = () => (
  <ProtectedRoute>
    <TrackingCar />
  </ProtectedRoute>
)

export default TrackingCarScreen;