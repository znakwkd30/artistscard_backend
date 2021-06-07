import { Database } from '../database';
import { AddMusicDTO } from '../dto/request/addMusic.dto';
import { Music } from '../entity/Music';

export interface MusicService {
    addMusic(body: AddMusicDTO, file: Express.Multer.File);
}

export class MusicServiceImpl implements MusicService {
    public async addMusic(body: AddMusicDTO, file: Express.Multer.File) {
        const music = new Music();
        music.title = body.title;
        music.album = body.album;
        music.track = body.track;
        music.artists = body.artists;
        music.path = file.path;

        await Database.musicRepository.save(music);

        return music;
    }
}
