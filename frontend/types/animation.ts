export interface Feature {
    id: number
    title: string
    description: string
    image: string
    bgColor: string
    textColor?: string
    imageSize: {
        width: number
        mdWidth: number
        imgWidth: number
    }
    reverse: boolean
}

export interface FeatureCardProps {
    feature: Feature
}

export interface GSAPObserver {
    scrollY: () => number
    isEnabled: boolean
    disable: () => void
    enable: () => void
    _restoreScroll?: () => void
    target?: Element | Window
    vars?: {
        onDown?: () => void
        onUp?: () => void
        tolerance?: number
        preventDefault?: boolean
        onEnable?: (self: GSAPObserver) => void
        onDisable?: (self: GSAPObserver) => void
        wheelSpeed?: number
    }
}

export interface GSAPTimeline {
    to: (target: string, vars: object) => GSAPTimeline
    from: (target: string, vars: object) => GSAPTimeline
    addLabel: (label: string) => GSAPTimeline
    tweenTo: (label: string, vars?: object) => GSAPTimeline
    nextLabel: () => string | null
    previousLabel: () => string | null
    paused: (value: boolean) => GSAPTimeline
}