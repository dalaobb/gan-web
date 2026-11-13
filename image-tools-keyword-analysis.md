# 图片工具关键词机会分析

给已有「浏览器本地 AI 扣人像 + 图片压缩」的 [bgg.one](https://bgg.one) 排下一个工具的优先级。面向全球英文用户。结论：先做证件照和本地格式转换套件；热门图生视频、AI 形象照和扩图先不要做。

本文是交互分析页 [图片工具关键词机会分析](https://cursor.com/canvas/store-f722c1fe-96a2-4eba-b0c6-0e2b54f0de9f/36d256d9-50df-4656-b210-5c3ca3e9b385) 的完整 Markdown 导出，检索日期为 **2026 年 11 月 12 日（美国东部时间）**。未追加新研究；文中数字均来自当时引用的公开源，没有公开体积的不虚构。同一词在 Google Ads、Semrush、Ahrefs 之间常差 30%–100%，以相对排序和量级为准，不要把单一数字当精确流量预测。

## 目录

- [要点](#要点)
- [建议首先做的 Top 5](#建议首先做的-top-5)
- [排序说明](#排序说明)
- [22 项对比总表](#22-项对比总表)
- [22 项完整表格](#22-项完整表格)
- [22 项分项详情](#22-项分项详情)
- [长尾落地页机会](#长尾落地页机会)
- [先不要当主线的](#先不要当主线的)
- [数据口径与来源](#数据口径与来源)
- [注意事项](#注意事项)

## 要点

| 项 | 结论 |
| --- | --- |
| 第一优先 | 证件照（与现有扣人像最契合） |
| 第二优先 | HEIC / WebP / AVIF 本地转换套件（不上传） |
| 不要先做 | 图生视频与 AI 形象照（要 GPU，且 2026 年相关热词在跌） |
| 核心差异化 | 全程本地跑、文件不上传 |

> **核心差异化仍是「全程本地跑、文件不上传」。** 数字均来自公开源。没有公开体积的不虚构；「需求排序值」只用于表内排序，不是虚构的全球搜索量。

## 建议首先做的 Top 5

1. **证件照 / 护照照**  
   和现有本地扣人像最契合。印度 passport size photo maker 单写 24.6 万/月（[Google Ads API，印度](https://www.seodata.dev/keyword/passport-size-photo?country=in)），加上美、英、申根等国别长尾，足够养活一整站落地页。可完全在浏览器跑，竞争是专业站而不是 Adobe 垄断。

2. **HEIC / WebP / AVIF 本地转换套件**  
   搜索量最实在的快速流量入口。仅 heic to jpg，美、印、英、德四国已超 46 万/月，再加 WebP 两个方向。技术几天就能上；顶部站多数上传文件，与 bgg.one「不上传」故事一致。顺手加 PNG↔JPG。

3. **图片 ↔ PDF**  
   需求极大（印度 images to pdf 单写 183 万/月），本地实现成本近零。头部词被 iLovePDF / SmallPDF 占死，不要当独立品牌打，要和转换器做在同一个工具箱里，吃随访和一些长尾。

4. **GIF 压缩 + 制作**  
   gif maker 美国 20 万级；压缩词 CPC 极高（$4.8–15.7），Discord 8MB 是真实付费点。ezgif 很强，但可用「完全本地、按目标体积压」切入。视频转 GIF（mp4 to gif 约 63 万，[Probedex / ezgif](https://probedex.ai/domain/ezgif.com) 口径，仅作参考）可放后一步。

5. **头像 PFP + 社交尺寸缩放**  
   量不如前几项，但能复用扣图和压缩，做出工具箱的完整路线。不要硬刚 image resizer 这个百万级、却被 Adobe/Canva/iLoveIMG 占住的主词，用平台预设尺寸做长尾页。

可以和第一批并行的快速赢：

- 背景虚化（现有分割模型直接加，几乎零开发成本）
- 电商白底图落地页（不是新工具，是去背景的 Amazon / eBay 规格页，CPC 很高）
- 清 EXIF、模糊人脸（加强「隐私、不上传」品牌，工作量小）

OCR（image to text 美国 9.05 万，CPC 约 $3.24，[seodata](https://www.seodata.dev/keyword/image-to-text)）可作第 6 项：量和单价都不错，但和现有扣图协同略弱，Tesseract.js 对手写支持有限。

## 排序说明

原分析页可用下拉框按下列字段排序，并可筛选「只看可在浏览器跑的」。本文件按 **优先级分从高到低** 排列（原页默认排序）。

优先级分（满分参考 100）的构成：

| 权重 | 维度 |
| --- | --- |
| 25% | 需求（有出处的搜索量级与意图质量） |
| 20% | 可突破性（新站能否排上去，是否有长尾切口） |
| 20% | 本地可行（能否在浏览器完全跑） |
| 15% | 与 bgg.one 现有扣图 / 压缩的协同 |
| 10% | 变现 |
| 10% | 上线速度 |

「需求排序值」只用于比较和排序，**不是**估出来的全球月搜索量。单元格里的搜索量都标注了出处和地区。变现分为 1–10 的主观评分，需与 CPC、客单价、成本一起看。

也可用这些字段自行重排：搜索需求（需求排序值）、竞争（低 < 中 < 高 < 极高）、浏览器本地可行性（可完全本地 > 可本地（有限）> 需服务端）、变现分、工具名。

## 22 项对比总表

默认按优先级分从高到低。共 22 项。

| # | 工具 | 竞争 | 浏览器本地 | 变现分 | 优先级分 | 需求排序值 |
| ---: | --- | --- | --- | ---: | ---: | ---: |
| 1 | 证件照 / 护照照 | 中 | 可完全本地 | 8/10 | 88 | 820 |
| 2 | HEIC 转 JPG | 高 | 可完全本地 | 7/10 | 86 | 780 |
| 3 | WebP 转 PNG / JPG | 高 | 可完全本地 | 7/10 | 84 | 720 |
| 4 | 图片 ↔ PDF | 极高 | 可完全本地 | 6/10 | 80 | 960 |
| 5 | GIF 制作 / 压缩 | 高 | 可完全本地 | 9/10 | 79 | 620 |
| 6 | 头像 / PFP 生成器 | 中 | 可完全本地 | 7/10 | 76 | 180 |
| 7 | 背景虚化（人像模式） | 中 | 可完全本地 | 6/10 | 75 | 150 |
| 8 | 图片缩放 / 社交尺寸 | 极高 | 可完全本地 | 6/10 | 74 | 900 |
| 9 | 电商白底产品图（Amazon） | 中 | 可完全本地 | 8/10 | 73 | 40 |
| 10 | 图片转文字 OCR | 高 | 可本地（有限） | 8/10 | 72 | 250 |
| 11 | 删除 EXIF / 元数据 | 低 | 可完全本地 | 5/10 | 70 | 50 |
| 12 | 模糊人脸 / 匿名化 | 低 | 可完全本地 | 5/10 | 69 | 60 |
| 13 | AVIF 转换器 | 中 | 可完全本地 | 5/10 | 68 | 90 |
| 14 | 图片提取配色 | 中 | 可完全本地 | 5/10 | 64 | 80 |
| 15 | 拼图 / 截图拼接 | 高 | 可完全本地 | 5/10 | 62 | 220 |
| 16 | 去水印 / 去物体（修图） | 高 | 可本地（有限） | 7/10 | 61 | 760 |
| 17 | 图片变清 / 放大 | 极高 | 可本地（有限） | 7/10 | 60 | 900 |
| 18 | 签名提取（透明底 PNG） | 低 | 可完全本地 | 3/10 | 58 | 20 |
| 19 | 老照片修复 / 上色 | 中 | 可本地（有限） | 7/10 | 46 | 100 |
| 20 | AI 职业形象照 | 高 | 需服务端 | 9/10 | 44 | 120 |
| 21 | 扩图 / Outpainting | 高 | 需服务端 | 5/10 | 40 | 80 |
| 22 | 图片转视频 | 极高 | 需服务端 | 4/10 | 32 | 200 |

## 22 项完整表格

下列 7 列与分析页表格一致：工具、预估搜索量、竞争、浏览器本地、技术、变现、优先级。单元格内含出处链接。因单元格较长，部分阅读器横向滚动更易读；完整正文另见下一节「分项详情」。

| 工具 | 预估搜索量 | 竞争 | 浏览器本地 | 技术 | 变现 | 优先级 |
| --- | --- | --- | --- | --- | --- | ---: |
| 证件照 / 护照照 | 工具意图主词 passport photo maker 全球约 12 万/月（[KWS Trends](https://www.kwstrends.com/keywords/us/passport-photo-maker) / Semrush，印度 7.4 万、美国 5,400）。印度 passport size photo 45 万、passport size photo maker 24.6 万（[Google Ads API / seodata](https://www.seodata.dev/keyword/passport-size-photo?country=in)）。美国 passport photo 24.6 万，但大量是「去哪里拍」（CVS 等），不等于在线工具需求。美国 us passport photo 8,100；英国 uk passport photo 8,100（[Google Ads API](https://www.seodata.dev/keyword/uk-passport-photo?country=gb)）。 | 中。前排有官方工具（[state.gov Photo Tool](https://tsg.phototool.state.gov/photo)）、idphoto4you、photogov、Cutout.Pro、PhotoAiD、123PassportPhoto，不是 Adobe/Canva 垄断。国别长尾页更容易突破。passport-photo.online、photogov.net 搜索流量约 21–25 万级（[Ahrefs 转引](https://ahrefstop.com/websites/idphoto4you.com)）。 | 可完全本地 | MediaPipe Face Landmarker + 现有扣像（MODNet/现有模型）+ 各国尺寸规则裁切。可参考 HivisionIDPhotos。换正装/美颜才需生成模型。 | 免费出图 + 付费排版打印、合规检查、换正装。美国 CPC 约 $1.3–2.4，印度 CPC 很低（$0.07–0.17），主要靠产品转化而非广告。（变现 8/10） | 88 |
| HEIC 转 JPG | 精确词 heic to jpg：美国 21.8 万–24.6 万（[Ahrefs 2026-08 美国 21.8 万](https://www.einpresswire.com/article/935658333/an-estimated-half-a-million-plus-u-s-searches-a-month-look-for-a-way-to-convert-image-files-back-to-jpeg)；[Google Ads API](https://www.seodata.dev/keyword/heic-to-jpg) 美国 24.6 万、[印度 16.5 万](https://www.seodata.dev/keyword/heic-to-jpg?country=in)、[英国 3.31 万](https://www.seodata.dev/keyword/heic-to-jpg?country=gb)；[Semrush 德国 2.22 万](https://www.semrush.com/website/heic.online/overview/)）。仅这四国已超 46 万，全球会更高，但不另估没有出处的总数。美国词簇（含 convert、heic to png 4.05 万、heic to jpeg 等）超 38 万（[Cleanor 引 Keyword Planner](https://cleanor.app/blog/heic-to-jpg-conversion-file-size-tax-benchmark)）。[heictojpg.com](https://probedex.ai/domain/heictojpg.com) 约 203 万月访问，81% 来自搜索（Probedex，2026-10）。 | 高。头部是 heictojpg.com、iLoveIMG、CloudConvert、Convertio。大多数顶部站会上传文件；「浏览器本地、不上传」是清晰差异点（FormatDrop 也在打这张牌）。CPC 低（约 $0.21–0.28）。 | 可完全本地 | libheif.wasm / heic2any / libheif-js。可批量、保留或清除 EXIF。 | 广告单价低，靠量。可学 FormatDrop：免费带水印 + $9.99/月批量 Pro。更适合和 WebP/AVIF/PNG 做成一个转换套件。（变现 7/10） | 86 |
| WebP 转 PNG / JPG | webp to png：美国 20.1 万（[Google Ads API](https://www.seodata.dev/keyword/webp-to-png)），Ahrefs 美国曾报 14.9 万（[EIN Presswire / FormatDrop](https://www.einpresswire.com/article/935658333/an-estimated-half-a-million-plus-u-s-searches-a-month-look-for-a-way-to-convert-image-files-back-to-jpeg)）；[印度 11 万](https://www.seodata.dev/keyword/webp-to-png?country=in)。webp to jpg：美国 13.5 万（[Google Ads API](https://www.seodata.dev/keyword/webp-to-jpg)），Ahrefs 美国曾报 10.3 万。iLoveIMG 顶部词含 webp to jpg；[Probedex](https://probedex.ai/domain/iloveimg.com) 给出该词约 120 万级（口径可能偏高，仅作参考，不当精确全球量）。 | 高。iLoveIMG、CloudConvert、专项转换站。头部难抢，但技术极简，应和 HEIC 做同一套件。 | 可完全本地 | 现代浏览器 createImageBitmap / Canvas；老浏览器可补 wasm 解码器。 | 与 HEIC 同套餐变现。CPC 中低（美国约 $0.96–1.36）。（变现 7/10） | 84 |
| 图片 ↔ PDF | 美国 jpg to pdf 20.1 万、image to pdf 6.05 万、pdf to jpg 16.5 万（[Google Ads API / jpg to pdf](https://www.seodata.dev/keyword/jpg-to-pdf)、[pdf to image](https://www.seodata.dev/keyword/pdf-to-image)）。印度极高：images to pdf 183 万、jpg to pdf converter 82.3 万（[Google Ads API，印度](https://www.seodata.dev/keyword/jpg-to-pdf?country=in)）。有对比页称 image to pdf 关键词体积约 148 万级（[Probedex 对 iLovePDF / SmallPDF 的比较页](https://probedex.ai/compare/ilovepdf.com-vs-smallpdf.com)）。 | 极高。iLovePDF（[Semrush 2026-10](https://www.semrush.com/website/ilovepdf.com/overview/) 报道月访问量达亿级）、SmallPDF（[同源约 4,693 万](https://www.semrush.com/website/smallpdf.com/overview/)）、Adobe、iLoveIMG 垄断头部词。新站几乎抢不到主词，但「不上传」和转换套件搭售仍值得做。 | 可完全本地 | jsPDF / pdf-lib（图转 PDF）；PDF.js 渲染到 Canvas（PDF 转图）。 | 美国 CPC 约 $0.78–1.73；印度 CPC 极低（$0.03–0.05）。靠批量合并、去水印订阅。（变现 6/10） | 80 |
| GIF 制作 / 压缩 | gif maker 美国 20.1 万（[Google Ads API](https://www.seodata.dev/keyword/gif-maker)）；[Probedex / ezgif](https://probedex.ai/domain/ezgif.com) 给出该词约 40.5 万（口径可能为全球 Semrush，仅作参考）。compress gif 美国 4.05 万（[gif compressor 相关词](https://www.seodata.dev/keyword/gif-compressor)）。ezgif 还持有 mp4 to gif 约 62.7 万、video to gif 约 27.1 万（Probedex）——相关词更大，但需要视频解码。 | 高。ezgif.com 约 676 万月访问（[Probedex](https://probedex.ai/domain/ezgif.com)，2026-10），几乎垄断 GIF 工具。其余为 Canva、Imgflip、Adobe Express。GIF 压缩比制作更有切口（Discord 8MB 限制）。 | 可完全本地 | gif.js / gifenc / gifski-wasm。视频转 GIF 需 ffmpeg.wasm，体积更大。 | gif compressor CPC 极高：compress gif 约 $4.77，gif size reducer 约 $15.65（Google Ads API）。可按目标体积（8MB/10MB）收费。（变现 9/10） | 79 |
| 头像 / PFP 生成器 | pfp maker 美国 1.48 万，profile picture maker 8,100，profile image creator 9,900（[Google Ads API](https://www.seodata.dev/keyword/pfp-maker)）。不算巨头词，但和现有扣人像高度契合。 | 中。Canva、Adobe Express、各类头像生成器。可靠「本地扣图 + 圆形裁切 + 渐变背景」差异化。 | 可完全本地 | 现有扣像 + Canvas 圆形裁剪、比例、底色/渐变。 | CPC 约 $2.8–2.9。可卖模板、批量导出多尺寸（LinkedIn / Discord / X）。（变现 7/10） | 76 |
| 背景虚化（人像模式） | blur background 美国 1.21 万；blur background photo / picture 8,100；blur image/photo background 6,600（Google Ads API / seodata）。搜索量中等，但与现有扣图几乎零成本。 | 中。Picsart、Canva、Fotor、手机系统人像模式教程也会占位。属工具箱增量，而非独立抢流量产品。 | 可完全本地 | 复用现有人像分割，背景做 Gaussian blur，不删背景。 | 免费获客、升级高清或批量。CPC 约 $1.8–2.6。（变现 6/10） | 75 |
| 图片缩放 / 社交尺寸 | image resizer 全球约 130 万、美国 55 万（[KWS Trends / Semrush](https://www.kwstrends.com/keywords/us/image-resizer)）；Google Ads 美国数字更低（Planner 24.6 万，seodata 11 万）——口径差异大，需谨慎引用。社交长尾小得多：resize image for instagram 等约 4,400（[instagram image resizer 相关词](https://www.seodata.dev/keyword/instagram-image-resizer)），youtube thumbnail maker 6,600（[美国，Google Ads API](https://www.seodata.dev/keyword/youtube-thumbnail-maker)）。 | 极高。前排：imageresizer.com、Adobe Express、simpleimageresizer.com、iLoveIMG、Canva。KD 86。不建议当独立首发 SEO 产品，建议作为工具箱配套，用平台预设尺寸做长尾。 | 可完全本地 | Canvas 缩放 + Instagram / YouTube / X / LinkedIn 预设尺寸。与现有压缩功能自然拼在一起。 | 头部 CPC 约 $2.3，但排名极难。靠工具箱留存和批量。（变现 6/10） | 74 |
| 电商白底产品图（Amazon） | 精确匹配极低：amazon product photo 美国仅 140（[Google Ads API](https://www.seodata.dev/keyword/amazon-product-photo)），white background product photo 50（[Google Ads API](https://www.seodata.dev/keyword/white-background-product-photo)）。不是搜索量垂钱，而是现有去背景的场景化落地页。 | 中。remove.bg、Photoroom、Canva 在「产品图」场景很强。但已有扣图，只要加白底、阴影和 Amazon 尺寸规范说明。 | 可完全本地 | 现有扣图 + 纯白底 + 投地阴 + 2000px 等平台规格。 | CPC 很高（$7–10 级）说明卖家付费意愿强。可做批量白底主图。不要当主 SEO 赛道。（变现 8/10） | 73 |
| 图片转文字 OCR | image to text 美国 9.05 万，image to text converter 2.22 万，extract text from image 1.21 万（[Google Ads API](https://www.seodata.dev/keyword/image-to-text)）。image to text ai 全球 6,600 且同比下降 76%（[Builders HQ / Keyword Planner](https://buildershq.net/keyword-topics/ai-image-and-design-tools)）——主流量仍是传统 OCR，而不是 AI 热词。 | 高。Google Lens、Adobe、OnlineOCR、imagetotext 类站点。规范印刷体好做，手写/多语言难度更高。 | 可本地（有限） | Tesseract.js；或 transformers.js + 轻量 OCR 模型。手写和复杂排版效果有限。 | CPC 高（约 $3.2）。可卖批量、多语言、表格识别。（变现 8/10） | 72 |
| 删除 EXIF / 元数据 | 词簇不大：remove exif 美国 1,300；metadata remover / delete metadata 4,400；remove image metadata 2,400（[Google Ads API](https://www.seodata.dev/keyword/remove-metadata)）。 | 低。多为小工具站和隐私教程，少有巨头垄断。和 bgg.one「不上传」品牌一致。 | 可完全本地 | exifr / piexifjs，或 Canvas 重绘（自动掉 EXIF）。可嵌进压缩和转换流程。 | 搜索量小，但 metadata remover CPC 约 $6.51，隐私意图强。更适合当配套功能。（变现 5/10） | 70 |
| 模糊人脸 / 匿名化 | blur face 美国 5,400，face blur 1,600（Google Ads API / seodata）。需求稳定但不大。 | 低。多为小工具和教程。可扩展到车牌打码，作隐私工具组。 | 可完全本地 | MediaPipe 人脸/车牌检测 + Canvas 模糊或像素化。 | CPC 约 $1.6–2.2。记者、社工、出售房屋照的隐私场景，适合当快速配套。（变现 5/10） | 69 |
| AVIF 转换器 | avif to jpg 美国 3.31 万（[Google Ads API](https://www.seodata.dev/keyword/avif-to-jpg)）；Ahrefs 美国曾报 3.7 万（[EIN Presswire / FormatDrop](https://www.einpresswire.com/article/935658333/an-estimated-half-a-million-plus-u-s-searches-a-month-look-for-a-way-to-convert-image-files-back-to-jpeg)）。avif converter 只有 720，用户直接搜「to jpg」。量远小于 HEIC/WebP，但在增长。 | 中。与其他格式转换站同质竞争，但专项站较少。应并进转换套件，不单独做站。 | 可完全本地 | 现代浏览器原生解码 + Canvas；兼容可走 wasm。 | CPC 约 $1.08。边际成本近零。（变现 5/10） | 68 |
| 图片提取配色 | color palette from image 美国 8,100，color palette generator from image 4,400（[Google Ads API](https://www.seodata.dev/keyword/color-palette-from-image)）。CPC 较高（$3.6–4.8）。 | 中。Coolors、Adobe Color、Canva Palette。设计师类用户，和扣图客群重合不高。 | 可完全本地 | Canvas 取色 + color-thief / culori 聚类。几天可做完。 | CPC 不错，但量小。更适合当工具箱彩蛋。（变现 5/10） | 64 |
| 拼图 / 截图拼接 | collage maker 美国 6.05 万，photo collage 2.71 万，photo collage maker 1.81 万（[Google Ads API](https://www.seodata.dev/keyword/photo-collage-maker)）。广告竞争极高（competition 0.91）。 | 高。Canva、Fotor、Adobe Express 模板资产强。纯浏览器拼截图是差异点，但难打过设计工具品牌。 | 可完全本地 | Canvas 网格/长图拼接。不需模型。 | CPC 约 $1.7–3.0，但获客成本高。优先级靠后。（变现 5/10） | 62 |
| 去水印 / 去物体（修图） | remove watermark 全球约 76 万（印度 30 万）；watermark remover 美国约 11–12 万（[KWS Trends](https://www.kwstrends.com/keywords/us/remove-watermark) / Google Ads API）。remove object from photo 类词簇美国约 1.48 万。视频/平台水印（TikTok、Sora、Gemini）是增长热词。 | 高。watermarkremover.io 约 370 万月访问（[Probedex](https://probedex.ai/domain/watermarkremover.io)），前排还有 Phototune、Picsman、Dewatermark。还有版权与合规风险：不要定位成「去掉别人的商业水印」。 | 可本地（有限） | LaMa / IOPaint 类 ONNX 可在浏览器跑（如 inpaint-web），大图慢、质量不如服务端。 | CPC 约 $1.7–2.8，付费意愿不错。建议定位为「去掉自拍里的随身物体/自己水印」，并做使用政策。 法律风险不低，不建议当首发主打产品。（变现 7/10） | 61 |
| 图片变清 / 放大 | image upscaler 全球约 90 万（印度 33 万、印尼 18 万、美国 5.5 万，[KWS Trends / Semrush](https://www.kwstrends.com/keywords/us/image-upscaler)）。相关词美国：upscale image 2.7 万、ai image upscaler 2.0 万。 | 极高。前排：imageupscaler.com、imgupscaler.com、Canva、Photiu、Adobe Firefly、Pixelcut、Upscale.media。质量门槛很高，轻量浏览器模型难以打赢。 | 可本地（有限） | Real-ESRGAN 轻量 ONNX / WebGPU。CPU 慢，大图易内存溢出。高质量仍建议 fal.ai 等 API。 | CPC 约 $2.0–2.3。服务端成本高，必须做登录和额度。免费用户容易把利润吃掉。（变现 7/10） | 60 |
| 签名提取（透明底 PNG） | transparent signature 美国仅 480，相近词多在 50–210（[Google Ads API](https://www.seodata.dev/keyword/transparent-signature)）。需求真实但极分散。 | 低。竞争小，多为小工具和教程。不要当产品主线。 | 可完全本地 | 阈值去底 + 现有扣图，几乎不用新模型。 | 量太小，只适合作为扣图的一个模式。（变现 3/10） | 58 |
| 老照片修复 / 上色 | ai photo restoration 全球 6,600（同比 -46%，[Builders HQ](https://buildershq.net/keywords/ai-photo-restoration)）；colorize photo 美国 8,100，colorize pictures 2.22 万（Google Ads API）；colorize AI 全球约 1.81 万（同比 -55%，[Builders HQ](https://buildershq.net/keywords/colorize-ai)）。 | 中。MyHeritage、VanceAI、Adobe、一批 AI 修图站。市场在收缩。 | 可本地（有限） | GFPGAN / CodeFormer / DDColor 偏重，浏览器可跑但慢。高质量仍需服务端。 | 情感付费点不错，CPC 修复约 $4.6。但量和趋势不支持先做。（变现 7/10） | 46 |
| AI 职业形象照 | ai headshot generator：[Builders HQ / Keyword Planner](https://buildershq.net/keywords/ai-headshot-generator) 全球 2.71 万（同比 -63%）；seodata 美国 3.31 万（口径年份不同，两者并列列出，不以其中一方覆盖另一方）。CPC 极高（美国 $6.54，全球竞价上沿 $6.15）。 | 高。Aragon、HeadshotPro、Canva 等专业班很多。红海且热度下降。 | 需服务端 | Flux / InstantID / IP-Adapter，需 fal.ai 或自建 GPU。浏览器本地不可行。 | 客单价最高的项之一，但推荐成本和生成成本都高。放到有用户和支付之后再做。（变现 9/10） | 44 |
| 扩图 / Outpainting | ai expand image 全球 3.31 万（同比 -70%，[Builders HQ](https://buildershq.net/keywords/ai-expand-image)）；美国 ai image extender 9,900、ai expand image 6,600；uncrop image 仅 320（[Google Ads API](https://www.seodata.dev/keyword/uncrop-image)）。 | 高。Adobe Firefly、Canva、各 AI 编辑器内置。热词正在冷下来。 | 需服务端 | 生成模型（SD/Flux 扩图），本地小模型质量不够。 | CPC 约 $1.4–1.9。不建议单独做站。（变现 5/10） | 40 |
| 图片转视频 | ai image to video 全球 7.4 万（美国 2.22 万，[RankDude](https://rankdude.ai/statistics/ai-image-to-video) / Google Ads，2026-10）。类目 22 个站点 Google 访问约 1,100 万且同比 -15%。image to video 美国 1.21 万（含非 AI 意图）。 | 极高。Kling、PixVerse、Higgsfield、Runway 前五名占 74% 访问量（[RankDude](https://rankdude.ai/statistics/ai-image-to-video)，2026-10）。典型套壳红海，且每次生成都要花钱。 | 需服务端 | 只能接 Kling / Runway / fal.ai 等 API。必须登录加额度，否则会被刷爆。 | 看似高价，实际是中间件溢价。不要作为 BgGone 主线。（变现 4/10） | 32 |

## 22 项分项详情

与上表为同一批数据，按优先级分从高到低展开，便于完整阅读搜索量口径、竞争、技术可行性和变现说明。

### 1. 证件照 / 护照照

- **优先级分：** 88
- **需求排序值（仅用于排序，不是全球搜索量）：** 820
- **预估搜索量：** 工具意图主词 passport photo maker 全球约 12 万/月（[KWS Trends](https://www.kwstrends.com/keywords/us/passport-photo-maker) / Semrush，印度 7.4 万、美国 5,400）。印度 passport size photo 45 万、passport size photo maker 24.6 万（[Google Ads API / seodata](https://www.seodata.dev/keyword/passport-size-photo?country=in)）。美国 passport photo 24.6 万，但大量是「去哪里拍」（CVS 等），不等于在线工具需求。美国 us passport photo 8,100；英国 uk passport photo 8,100（[Google Ads API](https://www.seodata.dev/keyword/uk-passport-photo?country=gb)）。
- **竞争：** 中。前排有官方工具（[state.gov Photo Tool](https://tsg.phototool.state.gov/photo)）、idphoto4you、photogov、Cutout.Pro、PhotoAiD、123PassportPhoto，不是 Adobe/Canva 垄断。国别长尾页更容易突破。passport-photo.online、photogov.net 搜索流量约 21–25 万级（[Ahrefs 转引](https://ahrefstop.com/websites/idphoto4you.com)）。
- **浏览器本地可行性：** 可完全本地
- **技术：** MediaPipe Face Landmarker + 现有扣像（MODNet/现有模型）+ 各国尺寸规则裁切。可参考 HivisionIDPhotos。换正装/美颜才需生成模型。
- **变现：** 免费出图 + 付费排版打印、合规检查、换正装。美国 CPC 约 $1.3–2.4，印度 CPC 很低（$0.07–0.17），主要靠产品转化而非广告。（变现 8/10）

### 2. HEIC 转 JPG

- **优先级分：** 86
- **需求排序值（仅用于排序，不是全球搜索量）：** 780
- **预估搜索量：** 精确词 heic to jpg：美国 21.8 万–24.6 万（[Ahrefs 2026-08 美国 21.8 万](https://www.einpresswire.com/article/935658333/an-estimated-half-a-million-plus-u-s-searches-a-month-look-for-a-way-to-convert-image-files-back-to-jpeg)；[Google Ads API](https://www.seodata.dev/keyword/heic-to-jpg) 美国 24.6 万、[印度 16.5 万](https://www.seodata.dev/keyword/heic-to-jpg?country=in)、[英国 3.31 万](https://www.seodata.dev/keyword/heic-to-jpg?country=gb)；[Semrush 德国 2.22 万](https://www.semrush.com/website/heic.online/overview/)）。仅这四国已超 46 万，全球会更高，但不另估没有出处的总数。美国词簇（含 convert、heic to png 4.05 万、heic to jpeg 等）超 38 万（[Cleanor 引 Keyword Planner](https://cleanor.app/blog/heic-to-jpg-conversion-file-size-tax-benchmark)）。[heictojpg.com](https://probedex.ai/domain/heictojpg.com) 约 203 万月访问，81% 来自搜索（Probedex，2026-10）。
- **竞争：** 高。头部是 heictojpg.com、iLoveIMG、CloudConvert、Convertio。大多数顶部站会上传文件；「浏览器本地、不上传」是清晰差异点（FormatDrop 也在打这张牌）。CPC 低（约 $0.21–0.28）。
- **浏览器本地可行性：** 可完全本地
- **技术：** libheif.wasm / heic2any / libheif-js。可批量、保留或清除 EXIF。
- **变现：** 广告单价低，靠量。可学 FormatDrop：免费带水印 + $9.99/月批量 Pro。更适合和 WebP/AVIF/PNG 做成一个转换套件。（变现 7/10）

### 3. WebP 转 PNG / JPG

- **优先级分：** 84
- **需求排序值（仅用于排序，不是全球搜索量）：** 720
- **预估搜索量：** webp to png：美国 20.1 万（[Google Ads API](https://www.seodata.dev/keyword/webp-to-png)），Ahrefs 美国曾报 14.9 万（[EIN Presswire / FormatDrop](https://www.einpresswire.com/article/935658333/an-estimated-half-a-million-plus-u-s-searches-a-month-look-for-a-way-to-convert-image-files-back-to-jpeg)）；[印度 11 万](https://www.seodata.dev/keyword/webp-to-png?country=in)。webp to jpg：美国 13.5 万（[Google Ads API](https://www.seodata.dev/keyword/webp-to-jpg)），Ahrefs 美国曾报 10.3 万。iLoveIMG 顶部词含 webp to jpg；[Probedex](https://probedex.ai/domain/iloveimg.com) 给出该词约 120 万级（口径可能偏高，仅作参考，不当精确全球量）。
- **竞争：** 高。iLoveIMG、CloudConvert、专项转换站。头部难抢，但技术极简，应和 HEIC 做同一套件。
- **浏览器本地可行性：** 可完全本地
- **技术：** 现代浏览器 createImageBitmap / Canvas；老浏览器可补 wasm 解码器。
- **变现：** 与 HEIC 同套餐变现。CPC 中低（美国约 $0.96–1.36）。（变现 7/10）

### 4. 图片 ↔ PDF

- **优先级分：** 80
- **需求排序值（仅用于排序，不是全球搜索量）：** 960
- **预估搜索量：** 美国 jpg to pdf 20.1 万、image to pdf 6.05 万、pdf to jpg 16.5 万（[Google Ads API / jpg to pdf](https://www.seodata.dev/keyword/jpg-to-pdf)、[pdf to image](https://www.seodata.dev/keyword/pdf-to-image)）。印度极高：images to pdf 183 万、jpg to pdf converter 82.3 万（[Google Ads API，印度](https://www.seodata.dev/keyword/jpg-to-pdf?country=in)）。有对比页称 image to pdf 关键词体积约 148 万级（[Probedex 对 iLovePDF / SmallPDF 的比较页](https://probedex.ai/compare/ilovepdf.com-vs-smallpdf.com)）。
- **竞争：** 极高。iLovePDF（[Semrush 2026-10](https://www.semrush.com/website/ilovepdf.com/overview/) 报道月访问量达亿级）、SmallPDF（[同源约 4,693 万](https://www.semrush.com/website/smallpdf.com/overview/)）、Adobe、iLoveIMG 垄断头部词。新站几乎抢不到主词，但「不上传」和转换套件搭售仍值得做。
- **浏览器本地可行性：** 可完全本地
- **技术：** jsPDF / pdf-lib（图转 PDF）；PDF.js 渲染到 Canvas（PDF 转图）。
- **变现：** 美国 CPC 约 $0.78–1.73；印度 CPC 极低（$0.03–0.05）。靠批量合并、去水印订阅。（变现 6/10）

### 5. GIF 制作 / 压缩

- **优先级分：** 79
- **需求排序值（仅用于排序，不是全球搜索量）：** 620
- **预估搜索量：** gif maker 美国 20.1 万（[Google Ads API](https://www.seodata.dev/keyword/gif-maker)）；[Probedex / ezgif](https://probedex.ai/domain/ezgif.com) 给出该词约 40.5 万（口径可能为全球 Semrush，仅作参考）。compress gif 美国 4.05 万（[gif compressor 相关词](https://www.seodata.dev/keyword/gif-compressor)）。ezgif 还持有 mp4 to gif 约 62.7 万、video to gif 约 27.1 万（Probedex）——相关词更大，但需要视频解码。
- **竞争：** 高。ezgif.com 约 676 万月访问（[Probedex](https://probedex.ai/domain/ezgif.com)，2026-10），几乎垄断 GIF 工具。其余为 Canva、Imgflip、Adobe Express。GIF 压缩比制作更有切口（Discord 8MB 限制）。
- **浏览器本地可行性：** 可完全本地
- **技术：** gif.js / gifenc / gifski-wasm。视频转 GIF 需 ffmpeg.wasm，体积更大。
- **变现：** gif compressor CPC 极高：compress gif 约 $4.77，gif size reducer 约 $15.65（Google Ads API）。可按目标体积（8MB/10MB）收费。（变现 9/10）

### 6. 头像 / PFP 生成器

- **优先级分：** 76
- **需求排序值（仅用于排序，不是全球搜索量）：** 180
- **预估搜索量：** pfp maker 美国 1.48 万，profile picture maker 8,100，profile image creator 9,900（[Google Ads API](https://www.seodata.dev/keyword/pfp-maker)）。不算巨头词，但和现有扣人像高度契合。
- **竞争：** 中。Canva、Adobe Express、各类头像生成器。可靠「本地扣图 + 圆形裁切 + 渐变背景」差异化。
- **浏览器本地可行性：** 可完全本地
- **技术：** 现有扣像 + Canvas 圆形裁剪、比例、底色/渐变。
- **变现：** CPC 约 $2.8–2.9。可卖模板、批量导出多尺寸（LinkedIn / Discord / X）。（变现 7/10）

### 7. 背景虚化（人像模式）

- **优先级分：** 75
- **需求排序值（仅用于排序，不是全球搜索量）：** 150
- **预估搜索量：** blur background 美国 1.21 万；blur background photo / picture 8,100；blur image/photo background 6,600（Google Ads API / seodata）。搜索量中等，但与现有扣图几乎零成本。
- **竞争：** 中。Picsart、Canva、Fotor、手机系统人像模式教程也会占位。属工具箱增量，而非独立抢流量产品。
- **浏览器本地可行性：** 可完全本地
- **技术：** 复用现有人像分割，背景做 Gaussian blur，不删背景。
- **变现：** 免费获客、升级高清或批量。CPC 约 $1.8–2.6。（变现 6/10）

### 8. 图片缩放 / 社交尺寸

- **优先级分：** 74
- **需求排序值（仅用于排序，不是全球搜索量）：** 900
- **预估搜索量：** image resizer 全球约 130 万、美国 55 万（[KWS Trends / Semrush](https://www.kwstrends.com/keywords/us/image-resizer)）；Google Ads 美国数字更低（Planner 24.6 万，seodata 11 万）——口径差异大，需谨慎引用。社交长尾小得多：resize image for instagram 等约 4,400（[instagram image resizer 相关词](https://www.seodata.dev/keyword/instagram-image-resizer)），youtube thumbnail maker 6,600（[美国，Google Ads API](https://www.seodata.dev/keyword/youtube-thumbnail-maker)）。
- **竞争：** 极高。前排：imageresizer.com、Adobe Express、simpleimageresizer.com、iLoveIMG、Canva。KD 86。不建议当独立首发 SEO 产品，建议作为工具箱配套，用平台预设尺寸做长尾。
- **浏览器本地可行性：** 可完全本地
- **技术：** Canvas 缩放 + Instagram / YouTube / X / LinkedIn 预设尺寸。与现有压缩功能自然拼在一起。
- **变现：** 头部 CPC 约 $2.3，但排名极难。靠工具箱留存和批量。（变现 6/10）

### 9. 电商白底产品图（Amazon）

- **优先级分：** 73
- **需求排序值（仅用于排序，不是全球搜索量）：** 40
- **预估搜索量：** 精确匹配极低：amazon product photo 美国仅 140（[Google Ads API](https://www.seodata.dev/keyword/amazon-product-photo)），white background product photo 50（[Google Ads API](https://www.seodata.dev/keyword/white-background-product-photo)）。不是搜索量垂钱，而是现有去背景的场景化落地页。
- **竞争：** 中。remove.bg、Photoroom、Canva 在「产品图」场景很强。但已有扣图，只要加白底、阴影和 Amazon 尺寸规范说明。
- **浏览器本地可行性：** 可完全本地
- **技术：** 现有扣图 + 纯白底 + 投地阴 + 2000px 等平台规格。
- **变现：** CPC 很高（$7–10 级）说明卖家付费意愿强。可做批量白底主图。不要当主 SEO 赛道。（变现 8/10）

### 10. 图片转文字 OCR

- **优先级分：** 72
- **需求排序值（仅用于排序，不是全球搜索量）：** 250
- **预估搜索量：** image to text 美国 9.05 万，image to text converter 2.22 万，extract text from image 1.21 万（[Google Ads API](https://www.seodata.dev/keyword/image-to-text)）。image to text ai 全球 6,600 且同比下降 76%（[Builders HQ / Keyword Planner](https://buildershq.net/keyword-topics/ai-image-and-design-tools)）——主流量仍是传统 OCR，而不是 AI 热词。
- **竞争：** 高。Google Lens、Adobe、OnlineOCR、imagetotext 类站点。规范印刷体好做，手写/多语言难度更高。
- **浏览器本地可行性：** 可本地（有限）
- **技术：** Tesseract.js；或 transformers.js + 轻量 OCR 模型。手写和复杂排版效果有限。
- **变现：** CPC 高（约 $3.2）。可卖批量、多语言、表格识别。（变现 8/10）

### 11. 删除 EXIF / 元数据

- **优先级分：** 70
- **需求排序值（仅用于排序，不是全球搜索量）：** 50
- **预估搜索量：** 词簇不大：remove exif 美国 1,300；metadata remover / delete metadata 4,400；remove image metadata 2,400（[Google Ads API](https://www.seodata.dev/keyword/remove-metadata)）。
- **竞争：** 低。多为小工具站和隐私教程，少有巨头垄断。和 bgg.one「不上传」品牌一致。
- **浏览器本地可行性：** 可完全本地
- **技术：** exifr / piexifjs，或 Canvas 重绘（自动掉 EXIF）。可嵌进压缩和转换流程。
- **变现：** 搜索量小，但 metadata remover CPC 约 $6.51，隐私意图强。更适合当配套功能。（变现 5/10）

### 12. 模糊人脸 / 匿名化

- **优先级分：** 69
- **需求排序值（仅用于排序，不是全球搜索量）：** 60
- **预估搜索量：** blur face 美国 5,400，face blur 1,600（Google Ads API / seodata）。需求稳定但不大。
- **竞争：** 低。多为小工具和教程。可扩展到车牌打码，作隐私工具组。
- **浏览器本地可行性：** 可完全本地
- **技术：** MediaPipe 人脸/车牌检测 + Canvas 模糊或像素化。
- **变现：** CPC 约 $1.6–2.2。记者、社工、出售房屋照的隐私场景，适合当快速配套。（变现 5/10）

### 13. AVIF 转换器

- **优先级分：** 68
- **需求排序值（仅用于排序，不是全球搜索量）：** 90
- **预估搜索量：** avif to jpg 美国 3.31 万（[Google Ads API](https://www.seodata.dev/keyword/avif-to-jpg)）；Ahrefs 美国曾报 3.7 万（[EIN Presswire / FormatDrop](https://www.einpresswire.com/article/935658333/an-estimated-half-a-million-plus-u-s-searches-a-month-look-for-a-way-to-convert-image-files-back-to-jpeg)）。avif converter 只有 720，用户直接搜「to jpg」。量远小于 HEIC/WebP，但在增长。
- **竞争：** 中。与其他格式转换站同质竞争，但专项站较少。应并进转换套件，不单独做站。
- **浏览器本地可行性：** 可完全本地
- **技术：** 现代浏览器原生解码 + Canvas；兼容可走 wasm。
- **变现：** CPC 约 $1.08。边际成本近零。（变现 5/10）

### 14. 图片提取配色

- **优先级分：** 64
- **需求排序值（仅用于排序，不是全球搜索量）：** 80
- **预估搜索量：** color palette from image 美国 8,100，color palette generator from image 4,400（[Google Ads API](https://www.seodata.dev/keyword/color-palette-from-image)）。CPC 较高（$3.6–4.8）。
- **竞争：** 中。Coolors、Adobe Color、Canva Palette。设计师类用户，和扣图客群重合不高。
- **浏览器本地可行性：** 可完全本地
- **技术：** Canvas 取色 + color-thief / culori 聚类。几天可做完。
- **变现：** CPC 不错，但量小。更适合当工具箱彩蛋。（变现 5/10）

### 15. 拼图 / 截图拼接

- **优先级分：** 62
- **需求排序值（仅用于排序，不是全球搜索量）：** 220
- **预估搜索量：** collage maker 美国 6.05 万，photo collage 2.71 万，photo collage maker 1.81 万（[Google Ads API](https://www.seodata.dev/keyword/photo-collage-maker)）。广告竞争极高（competition 0.91）。
- **竞争：** 高。Canva、Fotor、Adobe Express 模板资产强。纯浏览器拼截图是差异点，但难打过设计工具品牌。
- **浏览器本地可行性：** 可完全本地
- **技术：** Canvas 网格/长图拼接。不需模型。
- **变现：** CPC 约 $1.7–3.0，但获客成本高。优先级靠后。（变现 5/10）

### 16. 去水印 / 去物体（修图）

- **优先级分：** 61
- **需求排序值（仅用于排序，不是全球搜索量）：** 760
- **预估搜索量：** remove watermark 全球约 76 万（印度 30 万）；watermark remover 美国约 11–12 万（[KWS Trends](https://www.kwstrends.com/keywords/us/remove-watermark) / Google Ads API）。remove object from photo 类词簇美国约 1.48 万。视频/平台水印（TikTok、Sora、Gemini）是增长热词。
- **竞争：** 高。watermarkremover.io 约 370 万月访问（[Probedex](https://probedex.ai/domain/watermarkremover.io)），前排还有 Phototune、Picsman、Dewatermark。还有版权与合规风险：不要定位成「去掉别人的商业水印」。
- **浏览器本地可行性：** 可本地（有限）
- **技术：** LaMa / IOPaint 类 ONNX 可在浏览器跑（如 inpaint-web），大图慢、质量不如服务端。
- **变现：** CPC 约 $1.7–2.8，付费意愿不错。建议定位为「去掉自拍里的随身物体/自己水印」，并做使用政策。（变现 7/10）

**注意事项：** 法律风险不低，不建议当首发主打产品。

### 17. 图片变清 / 放大

- **优先级分：** 60
- **需求排序值（仅用于排序，不是全球搜索量）：** 900
- **预估搜索量：** image upscaler 全球约 90 万（印度 33 万、印尼 18 万、美国 5.5 万，[KWS Trends / Semrush](https://www.kwstrends.com/keywords/us/image-upscaler)）。相关词美国：upscale image 2.7 万、ai image upscaler 2.0 万。
- **竞争：** 极高。前排：imageupscaler.com、imgupscaler.com、Canva、Photiu、Adobe Firefly、Pixelcut、Upscale.media。质量门槛很高，轻量浏览器模型难以打赢。
- **浏览器本地可行性：** 可本地（有限）
- **技术：** Real-ESRGAN 轻量 ONNX / WebGPU。CPU 慢，大图易内存溢出。高质量仍建议 fal.ai 等 API。
- **变现：** CPC 约 $2.0–2.3。服务端成本高，必须做登录和额度。免费用户容易把利润吃掉。（变现 7/10）

### 18. 签名提取（透明底 PNG）

- **优先级分：** 58
- **需求排序值（仅用于排序，不是全球搜索量）：** 20
- **预估搜索量：** transparent signature 美国仅 480，相近词多在 50–210（[Google Ads API](https://www.seodata.dev/keyword/transparent-signature)）。需求真实但极分散。
- **竞争：** 低。竞争小，多为小工具和教程。不要当产品主线。
- **浏览器本地可行性：** 可完全本地
- **技术：** 阈值去底 + 现有扣图，几乎不用新模型。
- **变现：** 量太小，只适合作为扣图的一个模式。（变现 3/10）

### 19. 老照片修复 / 上色

- **优先级分：** 46
- **需求排序值（仅用于排序，不是全球搜索量）：** 100
- **预估搜索量：** ai photo restoration 全球 6,600（同比 -46%，[Builders HQ](https://buildershq.net/keywords/ai-photo-restoration)）；colorize photo 美国 8,100，colorize pictures 2.22 万（Google Ads API）；colorize AI 全球约 1.81 万（同比 -55%，[Builders HQ](https://buildershq.net/keywords/colorize-ai)）。
- **竞争：** 中。MyHeritage、VanceAI、Adobe、一批 AI 修图站。市场在收缩。
- **浏览器本地可行性：** 可本地（有限）
- **技术：** GFPGAN / CodeFormer / DDColor 偏重，浏览器可跑但慢。高质量仍需服务端。
- **变现：** 情感付费点不错，CPC 修复约 $4.6。但量和趋势不支持先做。（变现 7/10）

### 20. AI 职业形象照

- **优先级分：** 44
- **需求排序值（仅用于排序，不是全球搜索量）：** 120
- **预估搜索量：** ai headshot generator：[Builders HQ / Keyword Planner](https://buildershq.net/keywords/ai-headshot-generator) 全球 2.71 万（同比 -63%）；seodata 美国 3.31 万（口径年份不同，两者并列列出，不以其中一方覆盖另一方）。CPC 极高（美国 $6.54，全球竞价上沿 $6.15）。
- **竞争：** 高。Aragon、HeadshotPro、Canva 等专业班很多。红海且热度下降。
- **浏览器本地可行性：** 需服务端
- **技术：** Flux / InstantID / IP-Adapter，需 fal.ai 或自建 GPU。浏览器本地不可行。
- **变现：** 客单价最高的项之一，但推荐成本和生成成本都高。放到有用户和支付之后再做。（变现 9/10）

### 21. 扩图 / Outpainting

- **优先级分：** 40
- **需求排序值（仅用于排序，不是全球搜索量）：** 80
- **预估搜索量：** ai expand image 全球 3.31 万（同比 -70%，[Builders HQ](https://buildershq.net/keywords/ai-expand-image)）；美国 ai image extender 9,900、ai expand image 6,600；uncrop image 仅 320（[Google Ads API](https://www.seodata.dev/keyword/uncrop-image)）。
- **竞争：** 高。Adobe Firefly、Canva、各 AI 编辑器内置。热词正在冷下来。
- **浏览器本地可行性：** 需服务端
- **技术：** 生成模型（SD/Flux 扩图），本地小模型质量不够。
- **变现：** CPC 约 $1.4–1.9。不建议单独做站。（变现 5/10）

### 22. 图片转视频

- **优先级分：** 32
- **需求排序值（仅用于排序，不是全球搜索量）：** 200
- **预估搜索量：** ai image to video 全球 7.4 万（美国 2.22 万，[RankDude](https://rankdude.ai/statistics/ai-image-to-video) / Google Ads，2026-10）。类目 22 个站点 Google 访问约 1,100 万且同比 -15%。image to video 美国 1.21 万（含非 AI 意图）。
- **竞争：** 极高。Kling、PixVerse、Higgsfield、Runway 前五名占 74% 访问量（[RankDude](https://rankdude.ai/statistics/ai-image-to-video)，2026-10）。典型套壳红海，且每次生成都要花钱。
- **浏览器本地可行性：** 需服务端
- **技术：** 只能接 Kling / Runway / fal.ai 等 API。必须登录加额度，否则会被刷爆。
- **变现：** 看似高价，实际是中间件溢价。不要作为 BgGone 主线。（变现 4/10）

## 长尾落地页机会

证件照是长尾价值最高的一项：每个国家、每种证件做独立落地页，例如 US passport photo（2×2 英寸）、UK passport photo、Schengen visa photo、Indian passport size photo、Canada / Australia / Japan visa，以及驾照、考试证件。页面写清尺寸、头部占比、背景色、眼睛高度、是否允许眼镜；4×6 相纸排版是强转化点。

格式转换则是每个方向一页：heic to jpg / jpeg / png / pdf，webp to png / jpg / gif，avif to jpg，png to jpg、jpg to png，再加上 convert heic to jpg、heic to jpg converter 等变体。批量、保留或清除元数据、不上传，要写进标题和正文。

PDF 侧可覆盖 jpg to pdf、images to pdf、photo to pdf、merge jpg to pdf、pdf to jpg / png。印度英文词簇极大，可做多语言页，但不要期待短期排掉 iLovePDF。社交尺寸与 GIF 侧靠 Instagram / LinkedIn / YouTube thumbnail 1280×720 / X header / Discord 8MB GIF 这些目标体积和平台规格长尾，而不是硬刚 ezgif。

## 先不要当主线的

> **图生视频、AI 形象照、扩图、老照修复先放一放。** 都要服务端 GPU，抢的是同一波热词，且 2026 年这几类词多在下跌：形象照全球同比 -63%，扩图 -70%，修复 -46%（[Builders HQ](https://buildershq.net/keyword-topics/ai-image-and-design-tools)）；图转视频赛道访问量同比 -15%（[RankDude，2026-10](https://rankdude.ai/statistics/ai-image-to-video)）。

- 去水印：量大但红海，且有版权敏感。若做，定位成去掉自己照片里的物体，不要打「去平台水印」。
- 图片变清：全球约 90 万次搜索（[KWS Trends](https://www.kwstrends.com/keywords/us/image-upscaler)），但 Canva / Adobe / 专业站质量阈值已被养高。可以先用轻量模型做免费试用，不要当第一个投入重点。
- 签名提取、配色提取：需求真实但量太小，只适合作为现有工具的模式或彩蛋。

## 数据口径与来源

以下来源均在 2026 年 11 月 12 日（美国东部时间）的分析中实际引用。链接可点击核验；各工具口径可能不同，并列列出时不以一方覆盖另一方。

- **[Google Ads Keyword Planner](https://ads.google.com/home/lib_zulu/keyword-planner/)**（经 [seodata.dev](https://www.seodata.dev/) API / 词页，标注为美国、印度或英国）：近 12 个月月均，Google 会把体积归到区间。示例词页：[heic to jpg（美国）](https://www.seodata.dev/keyword/heic-to-jpg)、[heic to jpg（印度）](https://www.seodata.dev/keyword/heic-to-jpg?country=in)、[heic to jpg（英国）](https://www.seodata.dev/keyword/heic-to-jpg?country=gb)、[webp to png](https://www.seodata.dev/keyword/webp-to-png)、[webp to jpg](https://www.seodata.dev/keyword/webp-to-jpg)、[avif to jpg](https://www.seodata.dev/keyword/avif-to-jpg)、[jpg to pdf](https://www.seodata.dev/keyword/jpg-to-pdf)、[jpg to pdf（印度）](https://www.seodata.dev/keyword/jpg-to-pdf?country=in)、[pdf to image](https://www.seodata.dev/keyword/pdf-to-image)、[gif maker](https://www.seodata.dev/keyword/gif-maker)、[gif compressor](https://www.seodata.dev/keyword/gif-compressor)、[image to text](https://www.seodata.dev/keyword/image-to-text)、[pfp maker](https://www.seodata.dev/keyword/pfp-maker)、[photo collage maker](https://www.seodata.dev/keyword/photo-collage-maker)、[passport size photo（印度）](https://www.seodata.dev/keyword/passport-size-photo?country=in)、[uk passport photo（英国）](https://www.seodata.dev/keyword/uk-passport-photo?country=gb)、[remove metadata](https://www.seodata.dev/keyword/remove-metadata)、[color palette from image](https://www.seodata.dev/keyword/color-palette-from-image)、[transparent signature](https://www.seodata.dev/keyword/transparent-signature)、[uncrop image](https://www.seodata.dev/keyword/uncrop-image)。
- **[KWS Trends](https://www.kwstrends.com/)**（基于 Semrush 滚动月均 + Google Trends）：[passport photo maker](https://www.kwstrends.com/keywords/us/passport-photo-maker)、[image resizer](https://www.kwstrends.com/keywords/us/image-resizer)、[image upscaler](https://www.kwstrends.com/keywords/us/image-upscaler)、[remove watermark](https://www.kwstrends.com/keywords/us/remove-watermark)。
- **Ahrefs 美国数字：** [FormatDrop / EIN Presswire，2026-08-20](https://www.einpresswire.com/article/935658333/an-estimated-half-a-million-plus-u-s-searches-a-month-look-for-a-way-to-convert-image-files-back-to-jpeg)（heic to jpg 美国约 21.8 万等）；[Cleanor 引 Keyword Planner 的 HEIC 词簇](https://cleanor.app/blog/heic-to-jpg-conversion-file-size-tax-benchmark)。idphoto4you 等流量见 [Ahrefs 转引页](https://ahrefstop.com/websites/idphoto4you.com)。
- **[Builders HQ](https://buildershq.net/keyword-topics/ai-image-and-design-tools)**（2026-11-11 拉取的 Keyword Planner 全球数）：[AI 形象照](https://buildershq.net/keywords/ai-headshot-generator)、[扩图](https://buildershq.net/keywords/ai-expand-image)、[修复](https://buildershq.net/keywords/ai-photo-restoration)、[上色](https://buildershq.net/keywords/colorize-ai) 等。
- **Probedex 站点流量（2026-09/10）：** [heictojpg.com](https://probedex.ai/domain/heictojpg.com)、[ezgif.com](https://probedex.ai/domain/ezgif.com)、[iloveimg.com](https://probedex.ai/domain/iloveimg.com)、[watermarkremover.io](https://probedex.ai/domain/watermarkremover.io)。其 Search Volume 列口径未公开，仅作参考，不当精确全球量。
- **[RankDude（2026-10）](https://rankdude.ai/statistics/ai-image-to-video)：** 图片转视频赛道访问量与 7.4 万全球搜索量。Semrush 转引：[iLovePDF](https://www.semrush.com/website/ilovepdf.com/overview/)、[SmallPDF](https://www.semrush.com/website/smallpdf.com/overview/) 访问量、[heic.online 德国词](https://www.semrush.com/website/heic.online/overview/)。
- 官方证件照工具：[U.S. Department of State Photo Tool](https://tsg.phototool.state.gov/photo)。产品站点：[bgg.one](https://bgg.one)。

「passport photo」这类泛词混杂了线下拍照需求，评估工具机会时要看 maker、size photo、国别规格词。相关强机会还包括 png to jpg（美国 6.05 万，iLoveIMG 该词 Probedex 体积约 87.6 万，应并进转换套件；Probedex 口径仅作参考）以及视频转 GIF（ezgif 顶部词 mp4 to gif 约 62.7 万），后者技术更重，建议放在静态 GIF 压缩之后。

## 注意事项

- 不要把单一关键词工具给出的数字当成精确的全球月搜索次数；文中凡写「约」「级」「口径可能偏高」「仅作参考」的，都不应当事实精确值使用。
- Probedex 的 Search Volume 列、部分站点月访问量（尤其 iLovePDF 亿级报道）来自第三方估算，只用于判断量级和竞争强度。
- 去水印有版权与合规风险，不建议定位成「去掉别人的商业水印」或「去平台水印」。
- 需服务端的生成类工具（形象照、扩图、图转视频、高质量变清）必须做登录和额度，否则免费用户会把成本吃掉。
- 本文件是既有分析的导出，不是新一轮关键词调研。

原分析页：[图片工具关键词机会分析](https://cursor.com/canvas/store-f722c1fe-96a2-4eba-b0c6-0e2b54f0de9f/36d256d9-50df-4656-b210-5c3ca3e9b385)
