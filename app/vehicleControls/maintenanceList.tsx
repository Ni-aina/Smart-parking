import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import LoaderSkeleton from "@/components/ui/Skeleton";
import MaintenanceCard from "@/components/vehicles/MaintenanceCard";
import MaintenanceForm from "@/components/vehicles/MaintenanceForm";
import { Colors } from "@/constants/Colors";
import { useMaintenances } from "@/hooks/maintenance/useMaintenances";
import { VehicleMaintenanceInterface } from "@/types/maintenance";
import { VehicleInterface } from "@/types/vehicle";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";

const MaintenanceList = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const [vehicle, setVehicle] = useState<VehicleInterface | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingMaintenance, setEditingMaintenance] = useState<VehicleMaintenanceInterface | null>(null);

    const {
        maintenances,
        isLoadingMaintenances,
        handleCreate,
        isCreating,
        handleUpdate,
        isUpdating,
        handleDelete,
        isDeleting
    } = useMaintenances(vehicle?.id || "");

    useEffect(() => {
        if (params.vehicle) {
            try {
                const parsedVehicle = JSON.parse(params.vehicle as string);
                setVehicle(parsedVehicle);
            } catch (error) {
                console.error("Error parsing vehicle data:", error);
            }
        }
    }, [params.vehicle]);

    const handleAddMaintenance = () => {
        setEditingMaintenance(null);
        setShowForm(true);
    }

    const handleEditMaintenance = (maintenance: VehicleMaintenanceInterface) => {
        setEditingMaintenance(maintenance);
        setShowForm(true);
    }

    const handleDeleteMaintenance = async (maintenanceId: string) => {
        try {
            await handleDelete(maintenanceId);
        } catch (error) {
            console.error("Error deleting maintenance:", error);
        }
    }

    const handleFormSubmit = async (data: VehicleMaintenanceInterface) => {
        try {
            if (editingMaintenance) {
                await handleUpdate(data);
            } else {
                await handleCreate(data);
            }
            setShowForm(false);
            setEditingMaintenance(null);
        } catch (error) {
            console.error("Error saving maintenance:", error);
        }
    }

    const renderMaintenanceItem = ({ item }: { item: VehicleMaintenanceInterface }) => (
        <MaintenanceCard
            maintenance={item}
            onEdit={() => handleEditMaintenance(item)}
            onDelete={() => item.id && handleDeleteMaintenance(item.id)}
        />
    )

    if (isLoadingMaintenances) return (
        <View 
            style={{ 
                paddingTop: 60,
                padding: 20 
            }}>
            <LoaderSkeleton />
        </View>
    )

    if (showForm && vehicle) {
        return (
            <MaintenanceForm
                maintenance={editingMaintenance || undefined}
                vehicleId={vehicle.id}
                onSubmit={handleFormSubmit}
                isLoading={isCreating || isUpdating}
                setShowForm={setShowForm}
            />
        )
    }

    return (
       <>
            <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
                <Header
                        title={t(`vehicle_maintenance`)}
                        customBackAction={() => router.push("/trackingCar")}
                />

                {
                    vehicle && 
                        <View style={[styles.vehicleInfo, { backgroundColor: Colors[colorScheme].gray100 }]}>
                            <Text style={[styles.vehicleText, { color: Colors[colorScheme].text }]}>
                                {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                            </Text>
                        </View>
                }

                <View style={styles.content}>
                    {
                        maintenances.length === 0 ? 
                            <View style={styles.emptyContainer}>
                                <Feather name="tool" size={48} color={Colors[colorScheme].icon} />
                                <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
                                    {t("no_maintenance_records")}
                                </Text>
                                <Text style={[styles.emptySubtext, { color: Colors[colorScheme].icon }]}>
                                    {t("add_first_maintenance")}
                                </Text>
                            </View>
                        : 
                            <FlatList
                                data={maintenances}
                                renderItem={renderMaintenanceItem}
                                keyExtractor={(item) => item.id || ""}
                                contentContainerStyle={styles.listContainer}
                                showsVerticalScrollIndicator={false}
                            />
                    }
                </View>

                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: Colors[colorScheme].tint }]}
                    onPress={handleAddMaintenance}
                >
                    <Feather 
                        name="plus" 
                        size={24} 
                        color={Colors[colorScheme].background} 
                    />
                </TouchableOpacity>
            </View>
            {
                isDeleting && <Loading />
            }
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        padding: 20,
        gap: 20
    },
    backButton: {
        padding: 8
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center"
    },
    vehicleInfo: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 20
    },
    vehicleText: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center"
    },
    content: {
        flex: 1
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600"
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: "center"
    },
    listContainer: {
        paddingBottom: 80
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default MaintenanceList;
