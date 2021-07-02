import { useState, useEffect } from 'react';
import { Modal, notification, Table, Space, Button, Popconfirm, message, Popover } from 'antd';
import { FormOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { db } from '../../../utils/cloudBase';
import './index.css';

const Say = () => {
    // ————————————————————渲染说说表格————————————————————
    const [says, setSays] = useState([]);
    const [isMounted, setIsMounted] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    // 表头
    const columns = [
        {
            title: '说说内容',
            dataIndex: 'content',
            key: '_id',
            // render: text => <strong>{text}</strong>,
        },
        {
            title: '发布日期',
            dataIndex: 'date',
            key: '_id',
            sorter: (a, b) => a.date - b.date,
            render: text => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
            sortDirections: ['descend'],
            defaultSortOrder: ['ascend'],
        },

        {
            title: '操作',
            key: '_id',
            render: record => (
                <Space size="middle">
                    <Button type="primary" onClick={() => editSay(record._id)}>
                        修改
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该说说吗？"
                        onConfirm={() => deleteSay(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    // 获得所有说说
    const getAllSays = () => {
        setTableLoading(true);
        db.collection('says')
            .get()
            .then(res => {
                setSays(res.data);
                setTableLoading(false);
            });
    };
    // 组件挂载，获得所有说说
    useEffect(() => {
        isMounted && getAllSays();
        return () => {
            setIsMounted(false);
        };
    }, [isMounted]);
    // ————————————————————渲染说说表格end————————————————————

    // ————————————————————————————添加/编辑说说对话框————————————————————————————
    const [addSayVisible, setAddSayVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    // 某条说说的详细数据
    const [id, setId] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    // 显示对话框
    const showAddSay = () => {
        setAddSayVisible(true);
    };
    // 清空输入框
    const clearSayInput = () => {
        setContent('');
    };
    // 对话框确认
    const addSayOK = () => {
        if (!content) {
            message.info('请说点啥再发表！');
            return;
        }
        if (isEdit) {
            // 更新说说
            updateSay();
        } else {
            // 添加说说
            addSay();
        }
    };
    // 对话框取消
    const addSayCancel = () => {
        setAddSayVisible(false);
        clearSayInput();
        setIsEdit(false);
        setId('');
        setDate('');
    };
    // ————————————————————————————添加/编辑说说对话框end————————————————————————————

    // ——————————————————————————————对说说的操作————————————————————————————
    // 说说添加或更新后的操作
    const afterSayChange = isEdit => {
        const message = isEdit ? '更新说说成功' : '发表说说成功';
        const icon = isEdit ? (
            <FormOutlined style={{ color: 'blue' }} />
        ) : (
            <MessageOutlined style={{ color: 'blue' }} />
        );
        // 获取所有说说
        getAllSays();
        setAddSayVisible(false);
        // 清空输入框
        clearSayInput();
        setIsEdit(false);
        setId('');
        notification.open({
            message,
            icon,
            placement: 'bottomLeft',
            duration: 1.5,
        });
    };
    // 发送添加说说请求
    const addSay = () => {
        db.collection('says')
            .add({
                content,
                date: new Date().getTime(),
            })
            .then(() => {
                // 添加后的操作
                afterSayChange(0);
            });
    };
    // 发送更新说说请求
    const updateSay = () => {
        db.collection('says')
            .doc(id)
            .update({
                content,
                date,
            })
            .then(() => {
                // 更新后的操作
                afterSayChange(1);
                setDate('');
            });
    };
    // 点击编辑，根据ID获得说说详情
    const editSay = id => {
        setId(id);
        setIsEdit(true);
        setAddSayVisible(true);
        db.collection('says')
            .doc(id)
            .get()
            .then(res => {
                setContent(res.data[0].content);
                setDate(res.data[0].date);
            });
    };
    // 删除说说
    const deleteSay = id => {
        db.collection('says')
            .doc(id)
            .remove()
            .then(() => {
                getAllSays();
                notification.open({
                    message: '删除说说成功',
                    icon: <DeleteOutlined style={{ color: 'blue' }} />,
                    placement: 'bottomLeft',
                    duration: 1.5,
                });
            });
    };
    // ——————————————————————————————对说说的操作end————————————————————————————

    // 表情数据
    const emojiPeople =
        '😄😆😊😃😏😍😘😚😳😌😆😁😉😜😝😀😗😙😛😴😟😦😧😮😬😕😯😑😒😅😓😥😩😔😞😖😨😰😣😢😭😂😲😱😫😠😡😤😪😋😷😎😵👿😈😐😶😇👽💛💙💜❤️💚💔💓💗💕💞💘💖✨⭐🌟💫💥💥💢❗❓❕❔💤💨💦🎶🎵🔥💩💩💩👍👍👎👎👌👊👊✊✌️👋✋✋👐☝️👇👈👉🙌🙏👆👏💪🤘🖕🏃🏃👫👪👬👭💃👯🙆‍♀️🙅💁🙋👰🙇💏💑💆💇💅👦👧👩👨👶👵👴👲👳‍♂️👷👮👼👸😺😸😻😽😼🙀😿😹😾👹👺🙈🙉🙊💂‍♂️💀🐾👄💋💧👂👀👃👅💌👤👥💬💭';
    const emojiNature =
        '☀️☔☁️❄️⛄⚡🌀🌁🌊🐱🐶🐭🐹🐰🐺🐸🐯🐨🐻🐷🐽🐮🐗🐵🐒🐴🐎🐫🐑🐘🐼🐍🐦🐤🐥🐣🐔🐧🐢🐛🐝🐜🐞🐌🐙🐠🐟🐳🐋🐬🐄🐏🐀🐃🐅🐇🐉🐐🐓🐕🐖🐁🐂🐲🐡🐊🐪🐆🐈🐩🐾💐🌸🌷🍀🌹🌻🌺🍁🍃🍂🌿🍄🌵🌴🌲🌳🌰🌱🌼🌾🐚🌐🌞🌝🌚🌑🌒🌓🌔🌕🌖🌗🌘🌜🌛🌙🌍🌎🌏🌋🌌⛅';
    const emojiObj =
        '🎍💝🎎🎒🎓🎏🎆🎇🎐🎑🎃👻🎅🎄🎁🔔🔕🎋🎉🎊🎈🔮💿📀💾📷📹🎥💻📺📱☎️☎️📞📟📠💽📼🔉🔈🔇📢📣⌛⏳⏰⌚📻📡➿🔍🔎🔓🔒🔏🔐🔑💡🔦🔆🔅🔌🔋📲✉️📫📮🛀🛁🚿🚽🔧🔩🔨💺💰💴💵💷💶💳💸📧📥📤✉️📨📯📪📬📭📦🚪🚬💣🔫🔪💊💉📄📃📑📊📈📉📜📋📆📅📇📁📂✂️📌📎✒️✏️📏📐📕📗📘📙📓📔📒📚🔖📛🔬🔭📰🏈🏀⚽⚾🎾🎱🎱🏉🎳⛳🚵🚴🏇🏂🏊🏄🎿♠️♥️♣️♦️💎💍🏆🎼🎹🎻👾🎮🃏🎴🎲🎯🀄🎬📝📝📖🎨🎤🎧🎺🎷🎸👞👡👠💄👢👕👕👔👚👗🎽👖👘👙🎀🎩👑👒👞🌂💼👜👝👛👓🎣☕🍵🍶🍼🍺🍻🍸🍹🍷🍴🍕🍔🍟🍗🍖🍝🍛🍤🍱🍣🍥🍙🍘🍚🍜🍲🍢🍡🥚🍞🍩🍮🍦🍨🍧🎂🍰🍪🍫🍬🍭🍯🍎🍏🍊🍋🍒🍇🍉🍓🍑🍈🍌🍐🍍🍠🍆🍅🌽';
    const emojiPlace =
        '🏠🏡🏫🏢🏣🏥🏦🏪🏩🏨💒⛪🏬🏤🌇🌆🏯🏰⛺🏭🗼🗾🗻🌄🌅🌠🗽🌉🎠🌈🎡⛲🎢🚢🚤⛵⛵🚣⚓🚀✈️🚁🚂🚊🚞🚲🚡🚟🚠🚜🚙🚘🚗🚗🚕🚖🚛🚌🚍🚨🚓🚔🚒🚑🚐🚚🚋🚉🚆🚅🚄🚈🚝🚃🚎🎫⛽🚦🚥⚠️🚧🔰🏧🎰🚏💈♨️🏁🎌🏮🗿🎪🎭📍🚩';
    const emojiSymbol =
        '◀️⬇️▶️⬅️🔠🔡🔤➡️⬆️⏬⏫🔽⤵️⤴️↩️↪️🔼🔃🔄⏪⏩ℹ️🆗🔀🔁🔂🆕🔝🆙🆒🆓🆖🎦🈁📶🈹🈴🈺🈯🈷️🈶🈵🈚🈸🈳🈲🈂️🚻🚹🚺🚼🚭🅿️♿🚇🛄🉑🚾🚰🚮㊙️㊗️Ⓜ️🛂🛅🛃🉐🆑🆘🆔🚫🔞📵🚯🚱🚳🚷🚸⛔✳️❇️✴️💟🆚📳📴💹💱♈♉♊♋♌♍♎♏♐♑♒♓⛎🔯❎🅰️🅱️🆎🅾️💠♻️🔚🔙🔛🔜🕐🕜🕙🕥🕚🕦🕛🕧🕑🕝🕒🕞🕓🕟🕔🕠🕕🕡🕖🕢🕗🕣🕘🕤💲❌❗⁉️⭕✖️➕➖➗💮💯✔️☑️🔘🔗➰🔱▪️▫️◾◽◼️◻️⬛⬜✅🔲🔳⚫⚪🔴🔵🔷🔶🔹🔸🔺🔻';

    return (
        <>
            <div className="searchBox">
                <div type="primary" className="addLinkBtn" onClick={showAddSay}>
                    发表说说
                </div>
                <Modal
                    title={isEdit ? '更新说说' : '发表说说'}
                    visible={addSayVisible}
                    // style={{ top: 60 }}
                    // width={900}
                    onOk={addSayOK}
                    onCancel={addSayCancel}
                >
                    <div className="sayInputBox">
                        <textarea
                            className="sayInputText"
                            type="text"
                            value={content}
                            onChange={e => {
                                setContent(e.target.value);
                            }}
                        />
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiPeople}
                            trigger="click"
                        >
                            <Button>😄</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiNature}
                            trigger="click"
                        >
                            <Button>☀️</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiObj}
                            trigger="click"
                        >
                            <Button>🏀</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiPlace}
                            trigger="click"
                        >
                            <Button>⛪</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            overlayClassName="emojiContent"
                            placement="bottom"
                            content={emojiSymbol}
                            trigger="click"
                        >
                            <Button>🆗</Button>
                        </Popover>
                    </div>
                </Modal>
            </div>
            <Table
                size="middle"
                className="Table"
                bordered
                loading={tableLoading}
                pagination={{
                    position: ['bottomCenter'],
                    defaultPageSize: 11,
                    hideOnSinglePage: true,
                    showTitle: false,
                    size: ['small'],
                }}
                columns={columns}
                dataSource={says}
                rowKey={columns => columns._id}
                showSorterTooltip={false}
            />
        </>
    );
};

export default Say;
