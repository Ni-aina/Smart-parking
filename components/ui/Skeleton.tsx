import { MotiView, View } from "moti";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";

const LoaderSkeleton = () => {
    const colorSchema = useColorScheme() || "light";

    return (

        <MotiView
            transition={{
                type: "spring"
            }}
            animate={{ backgroundColor: "transparent" }}
        >
            <View style={
                {
                    marginVertical: 10,
                    flexDirection: "row",
                    columnGap: 10
                }
            }>
                <View style={{ maxWidth: "48%" }}>
                    <Skeleton colorMode={colorSchema} width="100%" height={100} radius={5} />
                </View>
                < View style={{ maxWidth: "48%" }}>
                    <Skeleton colorMode={colorSchema} width="100%" height={100} radius={5} />
                </View>
            </View>
            < Skeleton colorMode={colorSchema} width="100%" height={100} radius={5} />
            <View style={
                {
                    marginVertical: 10,
                    flexDirection: "row",
                    columnGap: 10
                }
            }>
                <View style={{ maxWidth: "67%" }}>
                    <Skeleton colorMode={colorSchema} width="100%" height={100} radius={5} />
                </View>
                < View style={{ maxWidth: "30%" }}>
                    <Skeleton colorMode={colorSchema} width="100%" height={100} radius={5} />
                </View>
            </View>
            < Skeleton colorMode={colorSchema} width="100%" height={100} radius={5} />
            <View style={
                {
                    marginVertical: 10,
                    flexDirection: "row",
                    columnGap: 10
                }
            }>
                <View style={{ maxWidth: "30%" }}>
                    <Skeleton colorMode={colorSchema} width="100%" height={100} radius={5} />
                </View>
                < View style={{ maxWidth: "67%" }}>
                    <Skeleton colorMode={colorSchema} width="100%" height={100} radius={5} />
                </View>
            </View>
        </MotiView>
    )
}

export default LoaderSkeleton;