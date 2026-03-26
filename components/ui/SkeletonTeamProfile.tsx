const SkeletonTeamProfile = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">

            {/* Header */}
            <div className="bg-dark-800/50 rounded-2xl p-8 border border-dark-700 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                    {/* Logo */}
                    <div className="w-16 h-16 skeleton rounded-lg"></div>

                    {/* Info */}
                    <div className="flex-1 space-y-4 w-full">
                        <div className="h-6 w-48 skeleton rounded"></div>

                        <div className="flex gap-2">
                            <div className="h-5 w-20 skeleton rounded"></div>
                            <div className="h-5 w-16 skeleton rounded"></div>
                            <div className="h-5 w-12 skeleton rounded"></div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-3 w-full skeleton rounded"></div>
                            <div className="h-3 w-5/6 skeleton rounded"></div>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <div className="h-10 w-full skeleton rounded"></div>
                        <div className="h-10 w-full skeleton rounded"></div>
                    </div>
                </div>
            </div>

            {/* Card reputação */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6 space-y-6">

                        {/* Título */}
                        <div className="h-5 w-40 skeleton rounded"></div>

                        {/* Rating */}
                        <div className="flex justify-between items-center">
                            <div className="h-8 w-20 skeleton rounded"></div>
                            <div className="h-4 w-24 skeleton rounded"></div>
                        </div>

                        {/* Barras */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 w-32 skeleton rounded"></div>
                                <div className="h-2 w-full skeleton rounded"></div>
                            </div>
                        ))}

                        {/* Botão */}
                        <div className="h-10 w-40 skeleton rounded mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonTeamProfile