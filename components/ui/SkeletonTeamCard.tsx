const SkeletonTeamCard = () => {
    return (
      <div className="bg-dark-800/50 border border-dark-800 rounded-xl p-6 animate-pulse relative overflow-hidden">
        
        {/* Topo */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 skeleton rounded-lg"></div>
  
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 skeleton rounded"></div>
            <div className="h-3 w-20 skeleton rounded"></div>
          </div>
        </div>
  
        {/* Descrição */}
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full skeleton rounded"></div>
          <div className="h-3 w-5/6 skeleton rounded"></div>
        </div>
  
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-700/50">
          <div className="h-4 w-16 skeleton rounded"></div>
          <div className="h-6 w-20 skeleton rounded"></div>
        </div>
      </div>
    )
  }
  
  export default SkeletonTeamCard