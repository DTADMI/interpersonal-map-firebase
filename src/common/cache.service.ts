import NodeCache from "node-cache";

/**
 * Cache initialization
 * **/
export const cache = new NodeCache( { stdTTL: 120, checkperiod: 600 } );
export const CACHE_KEYS = {
    MAPS: {
        ALL_MAPS : "All maps",
        USER_MAPS: "User maps"
    },
    PEOPLE: {
        ALL_PEOPLE : "All people"
    },
    RELATIONS: {
        ALL_RELATIONS : "All relationships"
    },
    STORIES: {
        ALL_STORIES : "All stories"
    }
}

export const clearAllCachedMaps = () => {
    for (const cacheKey of Object.keys(CACHE_KEYS.MAPS)) {
        cache.del(cacheKey);
    }
}

export const clearAllCachedPeople = () => {
    for (const cacheKey of Object.keys(CACHE_KEYS.PEOPLE)) {
        cache.del(cacheKey);
    }
}

export const clearAllCachedRelations = () => {
    for (const cacheKey of Object.keys(CACHE_KEYS.RELATIONS)) {
        cache.del(cacheKey);
    }
}

export const clearAllCachedStories = () => {
    for (const cacheKey of Object.keys(CACHE_KEYS.STORIES)) {
        cache.del(cacheKey);
    }
}

export const clearAllCache = () => {
    for (const cacheKey of Object.keys(Object.keys(CACHE_KEYS))) {
        cache.del(cacheKey);
    }
}