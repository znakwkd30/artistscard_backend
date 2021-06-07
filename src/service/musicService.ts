import { Database } from '../database';
import { AddMusicDTO } from '../dto/request/addMusic.dto';
import { Music } from '../entity/Music';

export interface MusicService {
    addMusic(body: AddMusicDTO, file: Express.Multer.File);
    searchMusic(title: string);
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

    public async searchMusic(title: string) {
        const musics = await Database.musicRepository
            .createQueryBuilder('music')
            .where('title like :title', { title: `%${title}%` })
            .getMany();

        return musics;
    }
}
