import { getEmotionImage } from '../../utils/get-emotion';
import './EmotionItem.css'

const EmotionItem = ({ emotionId, emotionName, isSelected, onClick }) => {
    return <div
        onClick={onClick}
        className={`EmotionItem ${isSelected !== "" ? `emotionID_${emotionId}` : ""}`}>
        <img src={getEmotionImage(emotionId)} />
        <div>{emotionName}</div>
    </div>
}

export default EmotionItem;