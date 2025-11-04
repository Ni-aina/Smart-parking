import ProtectedRoute from "@/components/ProtectedRoute";
import Icons from "@/components/ui/icons";
import RequestTooLong from "@/components/ui/requestTooLong";
import LoaderSkeleton from "@/components/ui/Skeleton";
import VehicleItem from "@/components/vehicles/VehicleItem";
import { Colors } from "@/constants/Colors";
import useVehicles from "@/hooks/useVehicles";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";

const TrackingCarSceen = () => {
  const router = useRouter();
  const colorSchema = useColorScheme() || "light";
  const {
    vehicles,
    errorFetching,
    isLoading,
    refetch,
    isRefetching
  } = useVehicles();

  const handleAddVehicle = () => {
    router.push("/addVehicle");
  }

  if (isLoading) return (
    <View
      style={styles.container}
    >
      <LoaderSkeleton />
    </View>
  )

  return (
    <ProtectedRoute>
      <View
        style={styles.container}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 5
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: Colors[colorSchema].text
            }}
          >
            My vehicles
          </Text>
          <Icons
            name="add"
            size={28}
            color={Colors[colorSchema].icon}
            onPress={handleAddVehicle}
          />
        </View>
        {
          errorFetching ?
            <RequestTooLong
              message={errorFetching.message}
              refresh={refetch}
            /> :

            <FlatList
              data={vehicles}
              keyExtractor={item => item.id?.toString()}
              renderItem={({ item }) =>
                <VehicleItem
                  vehicle={item}
                />
              }
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              showsVerticalScrollIndicator={false}
              refreshing={isRefetching}
              onRefresh={refetch}
            />
        }
      </View>
    </ProtectedRoute>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 15
  }
})

export default TrackingCarSceen;