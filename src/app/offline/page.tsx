import { Metadata } from "next";
import OfflineView from "./OfflineView";

export const metadata: Metadata = {
    title: "Offline - FIRE Planner",
};

export default function OfflinePage() {
    return <OfflineView />;
}
