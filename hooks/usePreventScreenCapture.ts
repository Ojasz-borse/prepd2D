import * as ScreenCapture from "expo-screen-capture";
import { useEffect } from "react";

/**
 * Custom hook to prevent screen capture while the component is mounted.
 * Automatically allows screen capture again when the component is unmounted.
 */
export const usePreventScreenCapture = () => {
    useEffect(() => {
        ScreenCapture.preventScreenCaptureAsync();
    }, []);
};
