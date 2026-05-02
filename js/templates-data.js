/* ========================================
   特典② コピペ不要のテンプレート（書籍巻末付録14本・フォーム式）
   ======================================== */
window.TEMPLATES_DATA = {
  categories: [
    { id: 'email',    name: 'メール',   emoji: '✉️' },
    { id: 'meeting',  name: '議事録',   emoji: '📝' },
    { id: 'document', name: '資料作成', emoji: '📄' }
  ],
  prompts: [
    /* === メール (5本) === */
    {
      id: 'tpl_email_a', num: 'No.01', cat: 'email', mode: 'form',
      title: 'A：社内報告メール',
      desc: '上司・チームへの定期報告。実績／課題／次週予定をまとめます。',
      point: '「実績→課題→次週」の3点セットが報告メールの定型。実績欄に数値を1つ入れると、メール全体の説得力が増す。',
      fields: [
        {key: '宛先', label: '宛先', placeholder: '例：田中部長', type: 'text'},
        {key: '件名の方向性', label: '件名の方向性', placeholder: '例：今週の進捗報告', type: 'text'},
        {key: '実績', label: '実績', placeholder: '例：A案件の見積完了、B社訪問', type: 'textarea'},
        {key: '課題', label: '課題', placeholder: '例：C案件の納期確認待ち', type: 'textarea'},
        {key: '次週の予定', label: '次週の予定', placeholder: '例：D案件キックオフ', type: 'textarea'}
      ],
      template:
'以下の条件で社内報告メールの下書きを作成してください。\n\n' +
'【宛先】{宛先}\n【件名の方向性】{件名の方向性}\n【報告内容】\n' +
'・実績：{実績}\n・課題：{課題}\n・次週の予定：{次週の予定}\n' +
'【トーン】丁寧・簡潔\n【文字数】200〜300字'
    },
    {
      id: 'tpl_email_b', num: 'No.02', cat: 'email', mode: 'form',
      title: 'B：日程調整メール',
      desc: '会議や打ち合わせの候補日を提示する場面で。',
      point: '候補は3つ提示するのが鉄則。1つだけだと「合わなければ詰む」、5つ以上だと相手が選びきれない。',
      fields: [
        {key: '宛先', label: '宛先', placeholder: '例：株式会社○○ 山田様', type: 'text'},
        {key: '目的', label: '目的', placeholder: '例：次回案件の打ち合わせ', type: 'text'},
        {key: '第1候補', label: '第1候補', placeholder: '例：5/15(木) 14:00〜15:00', type: 'text'},
        {key: '第2候補', label: '第2候補', placeholder: '例：5/16(金) 10:00〜11:00', type: 'text'},
        {key: '第3候補', label: '第3候補', placeholder: '例：5/19(月) 15:00〜16:00', type: 'text'},
        {key: '場所', label: '場所', placeholder: '例：弊社会議室A／オンライン(Zoom)', type: 'text'}
      ],
      template:
'以下の条件で日程調整メールの下書きを作成してください。\n\n' +
'【宛先】{宛先}\n【目的】{目的}\n【候補日時】\n' +
'・第1候補：{第1候補}\n・第2候補：{第2候補}\n・第3候補：{第3候補}\n' +
'【場所】{場所}\n【トーン】丁寧・簡潔\n【文字数】150〜200字'
    },
    {
      id: 'tpl_email_c', num: 'No.03', cat: 'email', mode: 'form',
      title: 'C：お礼・フォローメール',
      desc: '会議後・依頼対応後・面会後など、感謝を伝える場面で。',
      point: '「具体的に助かった点」を埋めるかどうかで温度差が出る。「ありがとうございました」だけでは形式的、固有名詞のあるお礼が記憶に残る。',
      fields: [
        {key: '宛先', label: '宛先', placeholder: '例：佐藤様', type: 'text'},
        {key: 'お礼の対象', label: 'お礼の対象', placeholder: '例：本日の打ち合わせ', type: 'text'},
        {key: '具体的に助かった点', label: '具体的に助かった点', placeholder: '例：弊社の課題を整理してご提案いただいた点', type: 'textarea'},
        {key: '今後の予定', label: '今後の予定', placeholder: '例：来週中に社内検討の上、ご連絡いたします', type: 'textarea'}
      ],
      template:
'以下の条件でお礼メールの下書きを作成してください。\n\n' +
'【宛先】{宛先}\n【お礼の対象】{お礼の対象}\n' +
'【具体的に助かった点】{具体的に助かった点}\n【今後の予定】{今後の予定}\n' +
'【トーン】丁寧・温かみ\n【文字数】100〜200字'
    },
    {
      id: 'tpl_email_d', num: 'No.04', cat: 'email', mode: 'form',
      title: 'D：依頼・催促メール',
      desc: '資料提出・回答・対応などをお願いする場面で。',
      point: '期限と提出方法をセットで書くと、相手がすぐ動ける。「○日まで」「メールで」の2点を必ず明記する。',
      fields: [
        {key: '宛先', label: '宛先', placeholder: '例：鈴木様', type: 'text'},
        {key: '依頼内容', label: '依頼内容', placeholder: '例：見積書のご確認', type: 'textarea'},
        {key: '期限', label: '期限', placeholder: '例：5/20(火) 17:00まで', type: 'text'},
        {key: '提出方法', label: '提出方法', placeholder: '例：メール返信にて', type: 'text'},
        {key: '補足', label: '補足', placeholder: '例：ご不明点はお電話でも構いません', type: 'textarea'}
      ],
      template:
'以下の条件で依頼メールの下書きを作成してください。\n\n' +
'【宛先】{宛先}\n【依頼内容】{依頼内容}\n【期限】{期限}\n' +
'【提出方法】{提出方法}\n【補足】{補足}\n' +
'【トーン】丁寧だが明確\n【文字数】150〜200字'
    },
    {
      id: 'tpl_email_e', num: 'No.05', cat: 'email', mode: 'form',
      title: 'E：謝罪・訂正メール',
      desc: '誤送信・記載ミス・対応遅延など、謝罪が必要な場面で。',
      point: '「事実→原因→対応」の順で書く。先に対応を書くと言い訳に聞こえる。冒頭は事実の認識から入るのがプロの謝罪。',
      fields: [
        {key: '宛先', label: '宛先', placeholder: '例：高橋様', type: 'text'},
        {key: '謝罪の対象', label: '謝罪の対象', placeholder: '例：先ほどお送りした見積書', type: 'text'},
        {key: '誤りの内容', label: '誤りの内容', placeholder: '例：金額が税抜表示になっていました', type: 'textarea'},
        {key: '原因', label: '原因', placeholder: '例：確認体制の不備', type: 'textarea'},
        {key: '対応', label: '対応', placeholder: '例：本メールに正しい見積書を添付いたします', type: 'textarea'}
      ],
      template:
'以下の条件で謝罪・訂正メールの下書きを作成してください。\n\n' +
'【宛先】{宛先}\n【謝罪の対象】{謝罪の対象}\n' +
'【誤りの内容】{誤りの内容}\n【原因】{原因}\n【対応】{対応}\n' +
'【トーン】誠実・簡潔\n【文字数】150〜250字'
    },
    /* === 議事録 (2本) === */
    {
      id: 'tpl_meet_a', num: 'No.06', cat: 'meeting', mode: 'form',
      title: '① 会議前：骨組み生成',
      desc: '会議前に「議事録の枠」だけ作っておく。会議中はメモを取るだけで済みます。',
      point: '会議の前に5分これをやるだけで、議事録作成時間が10分→3分に短縮できる。議題を3つまでに絞ると会議も引き締まる。',
      fields: [
        {key: '会議名', label: '会議名', placeholder: '例：5月度営業定例会議', type: 'text'},
        {key: '日時', label: '日時', placeholder: '例：2026/5/15(木) 14:00-15:00', type: 'text'},
        {key: '参加者', label: '参加者', placeholder: '例：田中部長、鈴木、佐藤、山田', type: 'textarea'},
        {key: '議題1', label: '議題1', placeholder: '例：4月実績の振り返り', type: 'text'},
        {key: '議題2', label: '議題2', placeholder: '例：5月のキャンペーン施策', type: 'text'},
        {key: '議題3', label: '議題3', placeholder: '例：新規顧客フォロー方針', type: 'text'}
      ],
      template:
'以下の会議の議事録テンプレートを作成してください。\n\n' +
'【会議名】{会議名}\n【日時】{日時}\n【参加者】{参加者}\n【議題】\n' +
'1. {議題1}\n2. {議題2}\n3. {議題3}\n\n' +
'以下の3要素で構成してください。\n' +
'・決定事項\n・TODO（担当者・期限付き）\n・次回予定\n\n' +
'まだ会議前なので、各項目は空欄にしてください。'
    },
    {
      id: 'tpl_meet_b', num: 'No.07', cat: 'meeting', mode: 'form',
      title: '② 会議後：メモ→議事録変換',
      desc: '会議中にとった生メモを貼り付けて、AIに議事録の体裁に整形してもらいます。',
      point: '走り書きでもOK。「誰が何を言ったか」より「何が決まったか」をAIに整理させるのがコツ。不明点は「※要確認」と書いてもらえばよい。',
      fields: [
        {key: 'メモ', label: '会議メモ（そのまま貼り付け）', placeholder: '例：田中部長「来週から新キャンペーン開始」、鈴木が資料準備、5/20まで...', type: 'textarea'}
      ],
      template:
'以下の会議メモを議事録に整理してください。\n\n' +
'【会議メモ】\n{メモ}\n\n' +
'【出力形式】\n' +
'・決定事項（箇条書き）\n' +
'・TODO（担当者・内容・期限をセットで記載）\n' +
'・次回予定（日時と議題）\n\n' +
'不明な点は「※要確認」と記載してください。\n' +
'敬語は不要。事実のみ記載してください。'
    },
    /* === 資料作成 (7本) === */
    {
      id: 'tpl_doc_a', num: 'No.08', cat: 'document', mode: 'form',
      title: '① ヒアリングシート（資料作成前の自問）',
      desc: '資料を作り始める前の30秒。まずこれを埋めると差し戻しが激減します。',
      point: '資料作成の差し戻しの大半は「目的・読み手」の整理不足が原因。最初の30秒に投資すれば、後の手戻りが半分以下になる。',
      fields: [
        {key: '目的', label: '1. この資料の目的は？', placeholder: '例：新サービスの社内承認をもらう', type: 'text'},
        {key: '読み手', label: '2. 誰が読むか？', placeholder: '例：役員5名（うち技術系2名）', type: 'text'},
        {key: '読後のゴール', label: '3. 読んだ後にどうなってほしいか？', placeholder: '例：予算500万円を承認してもらう', type: 'text'},
        {key: '必須情報', label: '4. 必ず入れるべきデータ・情報は？', placeholder: '例：市場規模、競合比較、ROI', type: 'textarea'},
        {key: '形式', label: '5. ページ数・形式の指定は？', placeholder: '例：パワポ10ページ以内', type: 'text'},
        {key: '期限', label: '6. 提出期限は？', placeholder: '例：5/20 17時', type: 'text'}
      ],
      template:
'【資料作成の条件整理】\n\n' +
'1. 目的：{目的}\n2. 読み手：{読み手}\n3. 読後のゴール：{読後のゴール}\n' +
'4. 必須情報：{必須情報}\n5. 形式：{形式}\n6. 期限：{期限}\n\n' +
'※このメモを次の「構成案生成」テンプレートに貼り付けて使用します。'
    },
    {
      id: 'tpl_doc_b', num: 'No.09', cat: 'document', mode: 'form',
      title: '② 構成案生成',
      desc: '①で整理した内容を元に、AIに資料の骨組みを作らせます。',
      point: '構成案の段階で上司に見せておくと、本文を書いた後の手戻りが激減する。「方向性が違う」と言われる事故を防ぐ。',
      fields: [
        {key: '目的', label: '目的', placeholder: '①の1から', type: 'text'},
        {key: '読み手', label: '読み手', placeholder: '①の2から', type: 'text'},
        {key: '読後のゴール', label: '読後のゴール', placeholder: '①の3から', type: 'text'},
        {key: '必須情報', label: '必須情報', placeholder: '①の4から', type: 'textarea'},
        {key: '形式', label: '形式', placeholder: '①の5から', type: 'text'}
      ],
      template:
'以下の条件で資料の構成案を作成してください。\n\n' +
'【目的】{目的}\n【読み手】{読み手}\n【読後のゴール】{読後のゴール}\n' +
'【必須情報】{必須情報}\n【形式】{形式}\n\n' +
'以下の形式で出力してください。\n' +
'・スライド番号\n・各スライドのタイトル\n・各スライドに入れる内容（箇条書き）\n' +
'・全体の流れの説明（1〜2文）'
    },
    {
      id: 'tpl_doc_c', num: 'No.10', cat: 'document', mode: 'form',
      title: '③ 本文生成',
      desc: '②で作った構成案を元に、各スライドの本文を生成します。',
      point: '構成案ができていれば、本文はAIにほぼ丸投げできる。修正は仕上げ段階で。最初から完璧を狙うより7割の本文を素早く作って磨く。',
      fields: [
        {key: '構成案', label: '構成案（②の出力をそのまま貼り付け）', placeholder: '構成案を貼り付け', type: 'textarea'}
      ],
      template:
'以下の資料構成案を元に、各スライドの本文を作成してください。\n\n' +
'【構成案】\n{構成案}\n\n' +
'【ルール】\n' +
'・1スライドあたり3〜5行（箇条書き）\n' +
'・数値は具体的に記載\n' +
'・結論を先に書く\n' +
'・専門用語は使わない'
    },
    {
      id: 'tpl_doc_d', num: 'No.11', cat: 'document', mode: 'form',
      title: 'Type A：週報・月報',
      desc: '定型の業務報告。期間・実績・達成率・来週のアクションをまとめます。',
      point: '「未達の原因」を入れると、来週のアクションに説得力が出る。「頑張ります」だけの来週予定は弱い。',
      fields: [
        {key: '期間', label: '期間', placeholder: '例：5/12〜5/16', type: 'text'},
        {key: '報告先', label: '報告先', placeholder: '例：営業部', type: 'text'},
        {key: '今週の目標', label: '今週の目標', placeholder: '例：新規アポ10件', type: 'text'},
        {key: '今週の実績', label: '今週の実績', placeholder: '例：新規アポ8件、A社受注', type: 'textarea'},
        {key: '達成率', label: '達成率', placeholder: '例：80%', type: 'text'},
        {key: '未達の原因', label: '未達の原因', placeholder: '例：見込み客リストの精度', type: 'textarea'},
        {key: '来週のアクション', label: '来週のアクション', placeholder: '例：リスト見直し、B社訪問', type: 'textarea'}
      ],
      template:
'以下の条件で週報を作成してください。\n\n' +
'【期間】{期間}\n【報告先】{報告先}\n【項目】\n' +
'・今週の目標：{今週の目標}\n・今週の実績：{今週の実績}\n・達成率：{達成率}\n' +
'・未達の原因：{未達の原因}\n・来週のアクション：{来週のアクション}\n\n' +
'箇条書き形式、200字以内で出力してください。'
    },
    {
      id: 'tpl_doc_e', num: 'No.12', cat: 'document', mode: 'form',
      title: 'Type B：提案・企画書',
      desc: '社内外の提案書。課題→提案→効果→費用→スケジュールの流れで整理します。',
      point: '効果は数値で、費用は具体的に。スケジュールは月単位でOK。決裁者が「投資判断」に必要な情報を揃えるのが目的。',
      fields: [
        {key: '提案内容', label: '提案内容', placeholder: '例：勤怠管理システムの刷新', type: 'text'},
        {key: '提案先', label: '提案先', placeholder: '例：管理部 部長', type: 'text'},
        {key: '現状の課題', label: '現状の課題', placeholder: '例：手作業で月20時間かかっている', type: 'textarea'},
        {key: '提案の効果', label: '提案の効果', placeholder: '例：月20時間→月3時間に短縮', type: 'textarea'},
        {key: '費用', label: '費用', placeholder: '例：初期50万円、月額3万円', type: 'text'},
        {key: '導入スケジュール', label: '導入スケジュール', placeholder: '例：6月選定、7月導入、8月本格運用', type: 'textarea'}
      ],
      template:
'以下の条件で提案書の構成を作成してください。\n\n' +
'【提案内容】{提案内容}\n【提案先】{提案先}\n【現状の課題】{現状の課題}\n' +
'【提案の効果】{提案の効果}\n【費用】{費用}\n【導入スケジュール】{導入スケジュール}\n\n' +
'構成は以下の順序で出力してください。\n' +
'1. 現状の課題\n2. 提案内容\n3. 期待効果（数値付き）\n' +
'4. 費用と投資回収\n5. スケジュール\n6. 次のステップ'
    },
    {
      id: 'tpl_doc_f', num: 'No.13', cat: 'document', mode: 'form',
      title: 'Type C：手順書・マニュアル',
      desc: '業務マニュアル・引き継ぎ資料。手順を1〜5ステップで整理します。',
      point: '「※注意」がつく手順はトラブルになりやすい場所。経験則をAIに整理させると、新人が同じミスをしなくなる。',
      fields: [
        {key: '作業名', label: '作業名', placeholder: '例：月次売上データの集計手順', type: 'text'},
        {key: '対象者', label: '対象者', placeholder: '例：新入社員', type: 'text'},
        {key: '手順1', label: '手順1', placeholder: '例：基幹システムから売上CSVをDL', type: 'text'},
        {key: '手順2', label: '手順2', placeholder: '例：Excelで部門別に集計', type: 'text'},
        {key: '手順3', label: '手順3', placeholder: '例：前年同月比を計算', type: 'text'},
        {key: '手順4', label: '手順4', placeholder: '例：グラフを作成', type: 'text'},
        {key: '手順5', label: '手順5', placeholder: '例：所定フォルダに保存', type: 'text'}
      ],
      template:
'以下の条件で手順書を作成してください。\n\n' +
'【作業名】{作業名}\n【対象者】{対象者}\n【手順】\n' +
'1. {手順1}\n2. {手順2}\n3. {手順3}\n4. {手順4}\n5. {手順5}\n\n' +
'各手順に補足説明を1行ずつ追加してください。\n' +
'よくある間違いがあれば「※注意」として記載してください。'
    },
    {
      id: 'tpl_doc_z', num: 'No.14', cat: 'document', mode: 'form',
      title: '⚙️ プロンプト改善（出力精度の調整）',
      desc: 'AIの出力が「なんか違う」ときに、修正を依頼する万能テンプレ。',
      point: '「違うところ」を指摘するだけで、AIは自分で修正できる。「全部書き直して」より「ここがこう違う」と指摘する方が早い。',
      fields: [
        {key: '問題点1', label: '問題点1', placeholder: '例：堅すぎる／長すぎる', type: 'text'},
        {key: '問題点2', label: '問題点2', placeholder: '例：数値が抽象的', type: 'text'},
        {key: '問題点3', label: '問題点3（任意）', placeholder: '例：結論が最後にきている', type: 'text'}
      ],
      template:
'前回の出力は以下の点が意図と異なりました。\n' +
'・{問題点1}\n・{問題点2}\n・{問題点3}\n\n' +
'修正して再出力してください。'
    }
  ]
};
