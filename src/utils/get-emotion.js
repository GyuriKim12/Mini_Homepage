import emotion1 from './../assets/emotion1.jpg'
import emotion2 from './../assets/emotion2.jpg'
import emotion3 from './../assets/emotion3.jpg'
import emotion4 from './../assets/emotion4.jpg'
import emotion5 from './../assets/emotion5.jpg'

export function getEmotionImage(emotionId) {
    switch (emotionId) {
        case 1: return emotion1;
        case 2: return emotion2;
        case 3: return emotion3;
        case 4: return emotion4;
        case 5: return emotion5;
        default: return null;

    }
}