package router

import (
	"net/http"
	"net/http/pprof"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(r *gin.Engine)  {

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    pprofGroup := r.Group("/debug/pprof")
    {
        pprofGroup.GET("/", gin.WrapH(http.HandlerFunc(pprof.Index)))
        pprofGroup.GET("/cmdline", gin.WrapH(http.HandlerFunc(pprof.Cmdline)))
        pprofGroup.GET("/profile", gin.WrapH(http.HandlerFunc(pprof.Profile)))
        pprofGroup.GET("/symbol", gin.WrapH(http.HandlerFunc(pprof.Symbol)))
        pprofGroup.GET("/trace", gin.WrapH(http.HandlerFunc(pprof.Trace)))
        pprofGroup.GET("/heap", gin.WrapH(http.HandlerFunc(pprof.Handler("heap").ServeHTTP)))
        pprofGroup.GET("/goroutine", gin.WrapH(http.HandlerFunc(pprof.Handler("goroutine").ServeHTTP)))
        pprofGroup.GET("/threadcreate", gin.WrapH(http.HandlerFunc(pprof.Handler("threadcreate").ServeHTTP)))
        pprofGroup.GET("/block", gin.WrapH(http.HandlerFunc(pprof.Handler("block").ServeHTTP)))
        pprofGroup.GET("/mutex", gin.WrapH(http.HandlerFunc(pprof.Handler("mutex").ServeHTTP)))
    }
}
