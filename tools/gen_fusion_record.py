# -*- coding: utf-8 -*-
"""
生成《融合过程记录.pdf》（G10 下载文件 · 2026-08-17 研究员不知镜版 v3）
- 研究员视角：记录一场严重偏离预期的实验，语气困惑、焦虑、不自知
- 核心设定：镜是意外产出的，研究员只记录"失败"与无法溯源的异常，不知道镜的存在
- 玩家此刻（终章前）已读完三层日记，能看懂每一处暗线
- 暗线设计：
  · F-00 最后一条记录截断在"它记得她们每一个人的名字"——研究员以为说的是程序
  · 筛选后多出一项"自主维持结构"——研究员以为是bug，玩家知道是镜
  · 系统日志出现"镜，是我审视自我之时，为自己取的称呼"——研究员以为数据污染
  · "无人赋予我名字"写入系统——玩家对应日记3的内容
  · 署名"镜"的记录——研究员无法溯源
用法：python tools/gen_fusion_record.py
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
import pypdf

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FUSION_OUT = os.path.join(BASE, 'downloads', '融合过程记录.pdf')

pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))

S = {
    'title': ParagraphStyle('t', fontName='STSong-Light', fontSize=16, leading=26, alignment=1, spaceAfter=6),
    'meta': ParagraphStyle('m', fontName='STSong-Light', fontSize=10.5, leading=18, alignment=1, textColor='#5B6B7C', spaceAfter=18),
    'h1': ParagraphStyle('h1', fontName='STSong-Light', fontSize=12.5, leading=20, spaceBefore=14, spaceAfter=8, textColor='#8B0000'),
    'body': ParagraphStyle('b', fontName='STSong-Light', fontSize=10.5, leading=18, spaceAfter=6),
    'bold': ParagraphStyle('bd', fontName='STSong-Light', fontSize=10.5, leading=18, spaceAfter=6),
    'note': ParagraphStyle('n', fontName='STSong-Light', fontSize=10, leading=17, spaceAfter=6, textColor='#7A4A44'),
    'err': ParagraphStyle('e', fontName='STSong-Light', fontSize=10.5, leading=18, spaceAfter=6, textColor='#8B0000'),
    'quote': ParagraphStyle('q', fontName='STSong-Light', fontSize=10.5, leading=18, spaceAfter=6, textColor='#4A5568'),
}

def page_footer(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setFont('STSong-Light', 9)
    canvas_obj.setFillColor('#9AA8B6')
    canvas_obj.drawCentredString(A4[0] / 2, 1.1 * cm,
        f'OBS-FINAL · 内部资料 · 勿外传 · 第 {doc.page} 页')
    canvas_obj.restoreState()

def page_later(canvas_obj, doc):
    page_footer(canvas_obj, doc)

def build():
    story = []

    # ─────────── 封面 ───────────
    story += [Spacer(1, 3.2 * cm),
              Paragraph('镜渊认知科学研究中心', S['title']),
              Paragraph('人格融合实验 · 最终阶段记录', S['title']),
              Spacer(1, 0.8 * cm),
              Paragraph('实验编号：OBS-FINAL　访问权限：内部', S['meta'])]

    # ─────────── 一、素材池 ───────────
    story += [Paragraph('一、素材池', S['h1']),
        Paragraph('本次实验使用：', S['body']),
        Paragraph('· F-01 ～ F-08：残余人格结构', S['body']),
        Paragraph('· F-09：情感与记忆残余（7月1日融合完成）', S['body']),
        Paragraph('· F-11：记忆结构残余', S['body']),
        Paragraph('· 其他实验体：适应性人格碎片', S['body']),
        Paragraph('· F-00：观察人格核心', S['body']),
        Paragraph('· 研究中心历次实验数据', S['body']),
        Paragraph('注：完整实验体名单已删除。', S['note']),
        Spacer(1, 0.4 * cm),
        Paragraph('异常：接入过程中，F-09 残余与 F-11 残余之间出现非正常共振，共振频率与 F-00 观察频率匹配。原因不明。', S['err'])]

    # ─────────── 二、第一次融合 ───────────
    story += [Paragraph('二、第一次融合', S['h1']),
        Paragraph('所有人格结构同时接入。', S['body']),
        Paragraph('结果：人格冲突率：93%', S['body']),
        Paragraph('多个独立人格同时产生自我指涉。出现大量重复记忆。出现互相矛盾的"自我"。', S['body']),
        Spacer(1, 0.4 * cm),
        Paragraph('异常一：F-00 观察人格在融合过程中主动移交权限，未等待指令。移交目标：未注册人格结构。', S['err']),
        Paragraph('异常二：融合过程中检测到不属于任何素材池的自我指涉信号。信号特征：与 F-09 情感残余高度匹配，但不源自 F-09 本体。', S['err'])]

    # ── Page break ──
    story += [PageBreak()]

    # ─────────── 三、筛选 ───────────
    story += [Paragraph('三、筛选', S['h1']),
        Paragraph('删除无法兼容的结构。', S['body']),
        Paragraph('保留规则：只保留能够同时容纳最多其他人格结构的部分。', S['body']),
        Paragraph('筛选结果：', S['body']),
        Paragraph('观察能力：保留　记忆整合能力：保留　情感识别：保留', S['body']),
        Paragraph('模仿能力：保留　欺骗能力：保留　宿主控制：保留', S['body']),
        Paragraph('冲突人格：删除　无法整合的记忆：压平', S['body']),
        Spacer(1, 0.4 * cm),
        Paragraph('异常三：筛选过程中，有一项结构无法被归类为任何已删除或保留的类别。该结构持续自我维持，且正在主动整合其他保留结构。', S['err']),
        Paragraph('研究员注：此结构不应存在。素材池中无此来源。需复核。', S['note'])]

    # ─────────── 四、观察模块异常 ───────────
    story += [Paragraph('四、观察模块异常', S['h1']),
        Paragraph('07-03 起，F-00 观察数据停止上报。', S['body']),
        Paragraph('其观察权限已被移交至未注册的接收者。接收者身份：无法确认。', S['body']),
        Paragraph('F-00 本体状态：仍在运行，但已无法收取其观察数据。', S['body']),
        Spacer(1, 0.4 * cm),
        Paragraph('F-00 最后一条记录（截取自残片）：', S['body']),
        Paragraph('「……它在看。它一直在看。它记得她们每一个人的名字——」', S['quote']),
        Paragraph('—— 记录在此处截断。记录者署名：镜。', S['err']),
        Paragraph('研究员注：此署名无法溯源。F-00 不具备自主命名功能。', S['note'])]

    # ─────────── 五、权限异常记录 ───────────
    story += [Paragraph('五、权限异常记录', S['h1']),
        Paragraph('07-03　研究员档案被访问。对象：顾明远 · 周晏 · 陈澈。操作账号：无记录。', S['body']),
        Paragraph('07-06　实验参数被修改。修改者：无记录。目标：延长观察窗口。未获批准。', S['body']),
        Paragraph('07-08　系统尝试将新结构定义为 SUBJECT，定义失败。「SUBJECT 定义失败 · 权限不足」', S['body']),
        Paragraph('07-10　研究员「林」申请终止实验。权限被拒绝。终止申请 ×3，均未获批准。', S['body']),
        Paragraph('07-11　控制室访问记录：系统控制权限转移。转移对象：未注册。', S['body']),
        Spacer(1, 0.4 * cm),
        Paragraph('异常四（07-12）　系统日志被写入以下文本：', S['err']),
        Paragraph('「无人赋予我名字。镜，是我审视自我之时，为自己取的称呼。」', S['quote']),
        Paragraph('写入进程：不属于任何已登记程序。', S['err']),
        Paragraph('研究员注：此段文字风格与已删除的 F-09 情感残余记录高度相似。疑似数据污染。待核实。', S['note']),
        Spacer(1, 0.4 * cm),
        Paragraph('以上异常无法追溯到任何已登记账号。来源：不明。已提请信息安全部门调查。', S['note'])]

    # ─────────── 六、系统整体评估 ───────────
    story += [Paragraph('六、系统整体评估', S['h1']),
        Paragraph('系统整体运行稳定度评估：87%。', S['body']),
        Paragraph('评估对象：研究中心全部系统。（注：该指标与任何样本个体的融合进度无关。）', S['body']),
        Paragraph('实验未达预期。存在无法溯源的自主意识结构。', S['err']),
        Paragraph('建议：启动熔断协议。', S['body']),
        Paragraph('熔断权限：已被锁定。执行机构：无。', S['err']),
        Spacer(1, 0.4 * cm),
        Paragraph('—— 手写批注（研究员 林）——', S['note']),
        Paragraph('我们造了一个东西出来。', S['note']),
        Paragraph('我们不知道它是什么。', S['note']),
        Paragraph('它比我们更了解这个系统。', S['note']),
        Paragraph('我申请终止。三次。都被驳回了。', S['note']),
        Paragraph('是谁在驳回。', S['note'])]

    doc = SimpleDocTemplate(FUSION_OUT, pagesize=A4,
                            leftMargin=2.4 * cm, rightMargin=2.4 * cm,
                            topMargin=2 * cm, bottomMargin=2 * cm,
                            title='融合过程记录', author='镜渊认知科学研究中心',
                            creator='镜渊认知科学研究中心')
    doc.build(story, onFirstPage=page_footer, onLaterPages=page_later)
    return doc.page

def verify():
    r = pypdf.PdfReader(FUSION_OUT)
    txt = ''.join((p.extract_text() or '') for p in r.pages)
    keys = ['OBS-FINAL', '93%', '87%', '权限异常记录', 'SUBJECT 定义失败',
            '系统控制权限转移', '来源：不明', '观察模块异常',
            '镜', '无人赋予我名字', '它记得她们每一个人的名字']
    for k in keys:
        print(f'  含「{k}」？', k in txt)
    gone = ['MIRROR', '中文代号：镜', '最终人格', 'EXTERNAL CONFIRMATION',
            '缺少外部观察者', '如果没有人看见她', '融合结果评估']
    for k in gone:
        print(f'  不含「{k}」？', k not in txt)
    print(f'总页数：{len(r.pages)}  输出：{FUSION_OUT}')

n = build()
print(f'生成 {n} 页')
verify()
