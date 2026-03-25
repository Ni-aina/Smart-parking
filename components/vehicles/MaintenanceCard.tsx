import { Colors } from "@/constants/Colors";
import { VehicleMaintenanceInterface } from "@/types/maintenance";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";

const { width } = Dimensions.get("window")

interface MaintenanceCardInterface {
  maintenance: VehicleMaintenanceInterface;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MaintenanceCard = ({
  maintenance,
  onEdit,
  onDelete
}: MaintenanceCardInterface) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const [showActions, setShowActions] = useState(false);

  const colors = Colors[colorScheme];

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const getTypeLabel = (type: string) => {
    return t(type) || type
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.gray200
        }
      ]}
    >

      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={[styles.typeText, { color: colors.text }]}>
            {getTypeLabel(maintenance.maintenanceType)}
          </Text>

          {
            maintenance.dueDate && isOverdue(maintenance.dueDate) && 
                <View style={[styles.overdueBadge]}>
                    <Text style={[
                        styles.overdueText,
                        { color: "#FFFFFF" }
                      ]}
                    >
                      {t("overdue")}
                    </Text>
                </View>
          }
        </View>

        {
            (onEdit || onDelete) && 
            <TouchableOpacity
                style={styles.moreButton}
                onPress={() => setShowActions(!showActions)}
            >
                <Feather name="more-vertical" size={20} color={colors.icon} />
            </TouchableOpacity>
        }
      </View>

      <View style={styles.content}>
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Feather name="calendar" size={14} color={colors.icon} />
            <Text style={[styles.dateLabel, { color: colors.icon }]}>
              {t("performed")}
            </Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>
              {formatDate(maintenance.performedDate)}
            </Text>
          </View>

          {
            maintenance.dueDate && 
                <View style={styles.dateItem}>
                    <Feather name="clock" size={14} color={colors.icon} />
                    <Text style={[styles.dateLabel, { color: colors.icon }]}>
                        {t("due")}
                    </Text>
                    <Text
                        style={[
                        styles.dateValue,
                        {
                            color: isOverdue(maintenance.dueDate)
                            ? colors.tint
                            : colors.text
                        }
                        ]}
                    >
                        {formatDate(maintenance.dueDate)}
                    </Text>
                </View>
          }
        </View>

        {
            maintenance.notes && 
            <View style={styles.notesContainer}>
                <Text style={[styles.notesLabel, { color: colors.icon }]}>
                {t("notes")}
                </Text>
                <Text
                numberOfLines={2}
                style={[styles.notesText, { color: colors.text }]}
                >
                {maintenance.notes}
                </Text>
            </View>
        }
      </View>

      {
        showActions && (onEdit || onDelete) && 
            <View
                style={[
                    styles.actions,
                    { borderTopColor: colors.gray200 }
                ]}
            >
            {
                onEdit && 
                    <TouchableOpacity
                    style={[
                        styles.actionButton,
                        { 
                            backgroundColor: colors.tint
                        }
                    ]}
                    onPress={() => {
                        onEdit()
                        setShowActions(false)
                    }}
                    >
                    <Feather name="edit-2" size={14} color={colors.background} />
                    <Text 
                        style={[
                            styles.actionButtonText, 
                            {
                                color: colors.background
                            }
                        ]}
                    >
                        {t("edit")}
                    </Text>
                    </TouchableOpacity>
            }

            {
                onDelete && 
                    <TouchableOpacity
                    style={[
                        styles.actionButton,
                        { backgroundColor: "#e63946" }
                    ]}
                    onPress={() => {
                        onDelete()
                        setShowActions(false)
                    }}
                    >
                    <Feather name="trash-2" size={14} color="#fff" />
                    <Text style={styles.actionButtonText}>{t("delete")}</Text>
                    </TouchableOpacity>
            }
            </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1
  },
  typeText: {
    fontSize: 15,
    fontWeight: "700"
  },
  overdueBadge: {
    backgroundColor: "#e63946",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  overdueText: {
    fontSize: 10,
    fontWeight: "700"
  },
  moreButton: {
    padding: 6
  },
  content: {
    gap: 6
  },
  dateRow: {
    flexDirection: width < 360 ? "column" : "row",
    justifyContent: "space-between",
    gap: 8
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap"
  },
  dateLabel: {
    fontSize: 11
  },
  dateValue: {
    fontSize: 12,
    fontWeight: "600"
  },
  notesContainer: {
    marginTop: 4
  },
  notesLabel: {
    fontSize: 11,
    marginBottom: 2
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  }
})

export default MaintenanceCard;