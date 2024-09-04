interface BadgeProps{
    children:React.ReactNode
}

export default function Badge({children}:BadgeProps){
    return <span className="border text-sm rounded px-2 py-0.5 text-muted-foreground font-medium">
        {children}
    </span>
}