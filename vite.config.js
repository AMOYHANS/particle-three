import viteCompression from 'vite-plugin-compression'

export default {
    plugins: [viteCompression({
        filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 需要压缩的文件
        threshold: 1024, // 文件容量大于这个值进行压缩
        algorithm: 'gzip', // 压缩方式
        ext: 'gz', // 后缀名
        deleteOriginFile: true, // 压缩后是否删除压缩源文件
      })]
}
