import { useState, useEffect } from 'react';
import { Modal, notification, Table, Space, Button, Popconfirm, message, Popover } from 'antd';
import moment from 'moment';
import { db } from '../../../utils/cloudBase';
import './index.css';

const Say = () => {
    // const { Panel } = Collapse;
    const [isMounted, setIsMounted] = useState(true);
    const [addSayVisible, setAddSayVisible] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [content, setContent] = useState('');
    const [says, setSays] = useState([]);

    const getAllSays = () => {
        db.collection('says')
            .get()
            .then(res => {
                setSays(res.data);
            });
    };
    useEffect(() => {
        isMounted && getAllSays();
        return () => {
            setIsMounted(false);
        };
    }, [isMounted]);

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
                    <Button type="primary" onClick={() => {}}>
                        修改
                    </Button>

                    <Popconfirm
                        placement="topRight"
                        title="确定要删除该友链吗？"
                        onConfirm={() => {}}
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

    const showAddSay = () => {
        setAddSayVisible(true);
    };
    const addSayOK = () => {
        db.collection('says')
            .add({
                content,
                date: new Date().getTime(),
            })
            .then(res => {
                console.log(res);
            });
    };
    const addSayCancel = () => {
        setAddSayVisible(false);
    };

    const emojiPeople =
        '😄 😆 😊 😃 😏 😍 😘 😚 😳 😌 😆 😁 😉 😜 😝 😀 😗 😙 😛 😴 😟 😦 😧 😮 😬 😕 😯 😑 😒 😅 😓 😥 😩 😔 😞 😖 😨 😰 😣 😢 😭 😂 😲 😱 😫 😠 😡 😤 😪 😋 😷 😎 😵 👿 😈 😐 😶 😇 👽 💛 💙 💜 ❤️ 💚 💔 💓 💗 💕 💞 💘 💖 ✨ ⭐ 🌟 💫 💥 💥 💢 ❗ ❓ ❕ ❔ 💤 💨 💦 🎶 🎵 🔥 💩 💩 💩 👍 👍 👎 👎 👌 👊 👊 ✊ ✌️ 👋 ✋ ✋ 👐 ☝️ 👇 👈 👉 🙌 🙏 👆 👏 💪 🤘 🖕 🏃 🏃 👫 👪 👬 👭 💃 👯 🙆‍♀️ 🙅 💁 🙋 👰 🙇 💏 💑 💆 💇 💅 👦 👧 👩 👨 👶 👵 👴 👲 👳‍♂️ 👷 👮 👼 👸 😺 😸 😻 😽 😼 🙀 😿 😹 😾 👹 👺 🙈 🙉 🙊 💂‍♂️ 💀 🐾 👄 💋 💧 👂 👀 👃 👅 💌 👤 👥 💬 💭';
    const emojiNature =
        '☀️ ☔ ☁️ ❄️ ⛄ ⚡ 🌀 🌁 🌊 🐱 🐶 🐭 🐹 🐰 🐺 🐸 🐯 🐨 🐻 🐷 🐽 🐮 🐗 🐵 🐒 🐴 🐎 🐫 🐑 🐘 🐼 🐍 🐦 🐤 🐥 🐣 🐔 🐧 🐢 🐛 🐝 🐜 🐞 🐌 🐙 🐠 🐟 🐳 🐋 🐬 🐄 🐏 🐀 🐃 🐅 🐇 🐉 🐐 🐓 🐕 🐖 🐁 🐂 🐲 🐡 🐊 🐪 🐆 🐈 🐩 🐾 💐 🌸 🌷 🍀 🌹 🌻 🌺 🍁 🍃 🍂 🌿 🍄 🌵 🌴 🌲 🌳 🌰 🌱 🌼 🌾 🐚 🌐 🌞 🌝 🌚 🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌜 🌛 🌙 🌍 🌎 🌏 🌋 🌌 ⛅';
    const emojiObj =
        '🎍 💝 🎎 🎒 🎓 🎏 🎆 🎇 🎐 🎑 🎃 👻 🎅 🎄 🎁 🔔 🔕 🎋 🎉 🎊 🎈 🔮 💿 📀 💾 📷 📹 🎥 💻 📺 📱 ☎️ ☎️ 📞 📟 📠 💽 📼 🔉 🔈 🔇 📢 📣 ⌛ ⏳ ⏰ ⌚ 📻 📡 ➿ 🔍 🔎 🔓 🔒 🔏 🔐 🔑 💡 🔦 🔆 🔅 🔌 🔋 📲 ✉️ 📫 📮 🛀 🛁 🚿 🚽 🔧 🔩 🔨 💺 💰 💴 💵 💷 💶 💳 💸 📧 📥 📤 ✉️ 📨 📯 📪 📬 📭 📦 🚪 🚬 💣 🔫 🔪 💊 💉 📄 📃 📑 📊 📈 📉 📜 📋 📆 📅 📇 📁 📂 ✂️ 📌 📎 ✒️ ✏️ 📏 📐 📕 📗 📘 📙 📓 📔 📒 📚 🔖 📛 🔬 🔭 📰 🏈 🏀 ⚽ ⚾ 🎾 🎱 🎱 🏉 🎳 ⛳ 🚵 🚴 🏇 🏂 🏊 🏄 🎿 ♠️ ♥️ ♣️ ♦️ 💎 💍 🏆 🎼 🎹 🎻 👾 🎮 🃏 🎴 🎲 🎯 🀄 🎬 📝 📝 📖 🎨 🎤 🎧 🎺 🎷 🎸 👞 👡 👠 💄 👢 👕 👕 👔 👚 👗 🎽 👖 👘 👙 🎀 🎩 👑 👒 👞 🌂 💼 👜 👝 👛 👓 🎣 ☕ 🍵 🍶 🍼 🍺 🍻 🍸 🍹 🍷 🍴 🍕 🍔 🍟 🍗 🍖 🍝 🍛 🍤 🍱 🍣 🍥 🍙 🍘 🍚 🍜 🍲 🍢 🍡 🥚 🍞 🍩 🍮 🍦 🍨 🍧 🎂 🍰 🍪 🍫 🍬 🍭 🍯 🍎 🍏 🍊 🍋 🍒 🍇 🍉 🍓 🍑 🍈 🍌 🍐 🍍 🍠 🍆 🍅 🌽';
    const emojiPlace =
        '🏠 🏡 🏫 🏢 🏣 🏥 🏦 🏪 🏩 🏨 💒 ⛪ 🏬 🏤 🌇 🌆 🏯 🏰 ⛺ 🏭 🗼 🗾 🗻 🌄 🌅 🌠 🗽 🌉 🎠 🌈 🎡 ⛲ 🎢 🚢 🚤 ⛵ ⛵ 🚣 ⚓ 🚀 ✈️ 🚁 🚂 🚊 🚞 🚲 🚡 🚟 🚠 🚜 🚙 🚘 🚗 🚗 🚕 🚖 🚛 🚌 🚍 🚨 🚓 🚔 🚒 🚑 🚐 🚚 🚋 🚉 🚆 🚅 🚄 🚈 🚝 🚃 🚎 🎫 ⛽ 🚦 🚥 ⚠️ 🚧 🔰 🏧 🎰 🚏 💈 ♨️ 🏁 🎌 🏮 🗿 🎪 🎭 📍 🚩';
    const emojiSymbol =
        '◀️ ⬇️ ▶️ ⬅️ 🔠 🔡 🔤 ➡️ ⬆️ ⏬ ⏫ 🔽 ⤵️ ⤴️ ↩️ ↪️ 🔼 🔃 🔄 ⏪ ⏩ ℹ️ 🆗 🔀 🔁 🔂 🆕 🔝 🆙 🆒 🆓 🆖 🎦 🈁 📶 🈹 🈴 🈺 🈯 🈷️ 🈶 🈵 🈚 🈸 🈳 🈲 🈂️ 🚻 🚹 🚺 🚼 🚭 🅿️ ♿ 🚇 🛄 🉑 🚾 🚰 🚮 ㊙️ ㊗️ Ⓜ️ 🛂 🛅 🛃 🉐 🆑 🆘 🆔 🚫 🔞 📵 🚯 🚱 🚳 🚷 🚸 ⛔ ✳️ ❇️ ✴️ 💟 🆚 📳 📴 💹 💱 ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ⛎ 🔯 ❎ 🅰️ 🅱️ 🆎 🅾️ 💠 ♻️ 🔚 🔙 🔛 🔜 🕐 🕜 🕙 🕥 🕚 🕦 🕛 🕧 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 💲 ❌ ❗ ⁉️ ⭕ ✖️ ➕ ➖ ➗ 💮 💯 ✔️ ☑️ 🔘 🔗 ➰ 🔱 ▪️ ▫️ ◾ ◽ ◼️ ◻️ ⬛ ⬜ ✅ 🔲 🔳 ⚫ ⚪ 🔴 🔵 🔷 🔶 🔹 🔸 🔺 🔻';
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
                            placement="bottom"
                            content={emojiPeople}
                            trigger="click"
                        >
                            <Button>😄</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            placement="bottom"
                            content={emojiNature}
                            trigger="click"
                        >
                            <Button>☀️</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            placement="bottom"
                            content={emojiObj}
                            trigger="click"
                        >
                            <Button>🏀</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
                            placement="bottom"
                            content={emojiPlace}
                            trigger="click"
                        >
                            <Button>⛪</Button>
                        </Popover>
                        <Popover
                            className="emojiBtn"
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
