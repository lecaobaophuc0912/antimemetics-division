
export type SeperatorLineProps = {
    color?: string;
    size?: string;
}

export const SeperatorLine: React.FC<SeperatorLineProps> = ({
    color,
    size
}: SeperatorLineProps) => {
    return (
        <div className="bg-gray-400 h-[1px] w-full"
            style={{
                backgroundColor: color ?? '#99a1af',
                height: size ?? '1px'
            }}></div>
    )
}