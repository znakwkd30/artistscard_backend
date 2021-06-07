import { Database } from '../database';
import { AddMusicDTO } from '../dto/request/addMusic.dto';
import { ModifyMusicDTO } from '../dto/request/modifyMusic.dto';
import { Music } from '../entity/Music';
import { NotFound } from '../error/notFound';

export interface MusicService {
    addMusic(body: AddMusicDTO, file: Express.Multer.File);
    searchMusic(title: string);
    modifyMusic(id: number, body: ModifyMusicDTO);
    modifyMusicFile(id: number, file: Express.Multer.File);
}

export class MusicServiceImpl implements MusicService {
    public async addMusic(body: AddMusicDTO, file: Express.Multer.File) {
        const music = new Music();
        music.title = body.title;
        music.album = body.album;
        music.track = body.track;
        music.artists = body.artists;
        music.originalName = file.filename;
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

    public async modifyMusic(id: number, body: ModifyMusicDTO) {
        const music = await this.getMusic(id);

        music.title = body.title;
        music.album = body.album;
        music.track = body.track;
        music.artists = body.artists;

        await Database.musicRepository.save(music);
    }

    public async modifyMusicFile(id: number, file: Express.Multer.File) {
        const music = await this.getMusic(id);

        music.originalName = file.originalname;
        music.path = file.path;

        await Database.musicRepository.save(music);
    }

    public async getMusic(id: number) {
        const music = await Database.musicRepository.findOne({ where: { id: id } });

        if (!music) {
            throw new NotFound(`${id}에 해당하는 음악이 없습니다.`);
        }

        return music;
    }
}
