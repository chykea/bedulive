
self.importScripts('/src/utils/spark-md5.js')

self.onmessage = e => {
    const { fileChunkList } = e.data;
    const spark = new self.SparkMD5.ArrayBuffer();
    let count = 0;
    let percentage = 0;
    const loadNext = index => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(fileChunkList[index].file);
        reader.onload = e => {
            count++;
            spark.append(e.target.result);
            if (count === fileChunkList.length) {
                self.postMessage({
                    hash: spark.end(),
                    percentage: 100
                })
                self.close();
            } else {
                percentage += 100 / fileChunkList.length
                self.postMessage({ percentage })
                loadNext(count);
            }
        }
    }
    loadNext(count)
}