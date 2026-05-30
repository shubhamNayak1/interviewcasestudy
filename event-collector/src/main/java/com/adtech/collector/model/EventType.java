package com.adtech.collector.model;

public enum EventType {
    AD_IMPRESSION,
    AD_CLICK,
    ADD_TO_CART,
    PRODUCT_VIEW,
    PRODUCT_CLICK;

    public static boolean isValid(String value) {
        for (EventType t : values()) {
            if (t.name().equalsIgnoreCase(value)) return true;
        }
        return false;
    }
}
