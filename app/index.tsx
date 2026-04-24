import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";

export default function Index() {
    const { isAuthenticated, user, hasHydrated, hasFetchedProfile } = useAppSelector((s) => s.auth);

    if (!hasHydrated) {
        return null; // Wait for hydration
    }

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    if (!hasFetchedProfile) {
        return null; // Wait for profile
    }

    const role = user?.role;
    const roleRoutes: Record<string, string> = {
        admin: "/(admin)/dashboard",
        manager: "/(manager)/dashboard",
        accountant: "/(accountant)/dashboard",
        picker: "/(picker)/dashboard",
        sup_picker: "/(sup_picker)/dashboard",
        shipper: "/(shipper)/dashboard",
        sup_shipper: "/(sup_shipper)/dashboard",
        seller: "/(seller)/dashboard",
    };

    const target = roleRoutes[role] || "/(seller)/dashboard";
    return <Redirect href={target as any} />;
}
