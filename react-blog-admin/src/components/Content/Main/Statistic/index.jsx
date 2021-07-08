import { useState, useEffect } from 'react';
import { db, dbTwikoo } from '../../../../utils/cloudBase';
import './index.css';

const ArticleNum = props => {
    const [num, setNum] = useState(0);
    const [type, setType] = useState('');
    useEffect(() => {
        switch (props.type) {
            case 'articles': {
                setType('文章');
                break;
            }
            case 'drafts': {
                setType('草稿');
                break;
            }
            case 'links': {
                setType('友链');
                break;
            }
            case 'shows': {
                setType('作品');
                break;
            }
            case 'says': {
                setType('说说');
                break;
            }
        }

        db.collection(props.type)
            .get()
            .then(res => {
                setNum(res.data.length);
            });
    }, []);
    return (
        <div className={props.isRight ? 'numberBox marginRight' : 'numberBox'}>
            <span className="type">{type}数</span>
            <span className="number">{num}</span>
        </div>
    );
};

export default ArticleNum;
